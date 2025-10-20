import { useState, useEffect, useRef, useCallback } from "react";
import * as KeepAwake from "expo-keep-awake";
import {
	TimerState,
	PomodoroSession,
	PomodoroSettings,
	SessionType,
	TimerStatus,
} from "../types";
import { StorageUtils } from "../utils/storage";
import { NotificationUtils } from "../utils/notifications";
import {
	generateId,
	getNextSessionType,
	getDurationForSessionType,
} from "../utils/timer";

export const useTimer = () => {
	const [timerState, setTimerState] = useState<TimerState>({
		currentSession: null,
		remainingTime: 25 * 60, // 25 minutes in seconds
		status: "idle",
		sessionType: "work",
		sessionCount: 0,
	});

	const [settings, setSettings] = useState<PomodoroSettings>({
		workDuration: 25,
		breakDuration: 5,
		longBreakDuration: 15,
		sessionsUntilLongBreak: 4,
	});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const notificationIdRef = useRef<string | null>(null);

	// Load settings from storage on mount
	useEffect(() => {
		const loadSettings = async () => {
			const storedSettings = await StorageUtils.getSettings();
			setSettings(storedSettings);

			// Update initial timer with stored settings
			const initialDuration = getDurationForSessionType(
				"work",
				storedSettings.workDuration
			);
			setTimerState((prev) => ({
				...prev,
				remainingTime: initialDuration * 60,
			}));
		};

		loadSettings();
	}, []);

	// Cleanup timer on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (notificationIdRef.current) {
				NotificationUtils.cancelNotification(notificationIdRef.current);
			}
		};
	}, []);

	// Handle timer countdown
	const tick = useCallback(() => {
		setTimerState((prev) => {
			const newTime = prev.remainingTime - 1;

			if (newTime <= 0) {
				// Session completed
				return {
					...prev,
					remainingTime: 0,
					status: "completed",
				};
			}

			return {
				...prev,
				remainingTime: newTime,
			};
		});
	}, []);

	// Handle session completion
	useEffect(() => {
		if (timerState.status === "completed") {
			handleSessionComplete();
		}
	}, [timerState.status]);

	const handleSessionComplete = async () => {
		// Stop timer
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Show completion notification
		await NotificationUtils.showCompletionNotification(timerState.sessionType);

		// Disable keep awake
		KeepAwake.deactivateKeepAwake();

		// Trigger haptic feedback
		await NotificationUtils.triggerHapticFeedback();

		// Save completed session
		if (timerState.currentSession) {
			const completedSession: PomodoroSession = {
				...timerState.currentSession,
				endTime: new Date(),
				completed: true,
			};

			await StorageUtils.saveSession(completedSession);
			await StorageUtils.updateDailyStats(completedSession);
		}

		// Calculate next session
		const nextSessionType = getNextSessionType(
			timerState.sessionType,
			timerState.sessionCount + 1,
			settings.sessionsUntilLongBreak
		);

		const nextDuration = getDurationForSessionType(
			nextSessionType,
			settings.workDuration,
			settings.breakDuration,
			settings.longBreakDuration
		);

		setTimerState((prev) => ({
			...prev,
			sessionType: nextSessionType,
			remainingTime: nextDuration * 60,
			sessionCount:
				nextSessionType === "work" ? prev.sessionCount + 1 : prev.sessionCount,
			currentSession: null,
		}));
	};

	const startTimer = async () => {
		// Create new session
		const newSession: PomodoroSession = {
			id: generateId(),
			type:
				timerState.sessionType === "longBreak"
					? "break"
					: timerState.sessionType,
			duration: Math.ceil(timerState.remainingTime / 60),
			startTime: new Date(),
			completed: false,
		};

		// Schedule completion notification only
		const notificationId = await NotificationUtils.scheduleTimerNotification(
			timerState.sessionType,
			Math.ceil(timerState.remainingTime / 60)
		);

		if (notificationId) {
			notificationIdRef.current = notificationId;
		}

		// Enable keep awake
		await KeepAwake.activateKeepAwakeAsync();

		// Start countdown
		intervalRef.current = setInterval(tick, 1000);

		setTimerState((prev) => ({
			...prev,
			status: "running",
			currentSession: newSession,
		}));
	};

	const pauseTimer = async () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Cancel notification
		if (notificationIdRef.current) {
			await NotificationUtils.cancelNotification(notificationIdRef.current);
			notificationIdRef.current = null;
		}

		// Disable keep awake
		KeepAwake.deactivateKeepAwake();

		setTimerState((prev) => ({
			...prev,
			status: "paused",
		}));
	};

	const resetTimer = async () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// Cancel notification
		if (notificationIdRef.current) {
			await NotificationUtils.cancelNotification(notificationIdRef.current);
			notificationIdRef.current = null;
		}

		// Disable keep awake
		KeepAwake.deactivateKeepAwake();

		const duration = getDurationForSessionType(
			"work",
			settings.workDuration,
			settings.breakDuration,
			settings.longBreakDuration
		);

		setTimerState({
			currentSession: null,
			remainingTime: duration * 60,
			status: "idle",
			sessionType: "work",
			sessionCount: 0,
		});
	};

	const skipSession = async () => {
		if (timerState.status === "running") {
			await pauseTimer();
		}

		// Calculate next session type
		const nextSessionType = getNextSessionType(
			timerState.sessionType,
			timerState.sessionCount + 1,
			settings.sessionsUntilLongBreak
		);

		const nextDuration = getDurationForSessionType(
			nextSessionType,
			settings.workDuration,
			settings.breakDuration,
			settings.longBreakDuration
		);

		setTimerState((prev) => ({
			...prev,
			sessionType: nextSessionType,
			remainingTime: nextDuration * 60,
			sessionCount:
				nextSessionType === "work" ? prev.sessionCount + 1 : prev.sessionCount,
			status: "idle",
			currentSession: null,
		}));
	};

	const updateSettings = async (newSettings: PomodoroSettings) => {
		await StorageUtils.saveSettings(newSettings);
		setSettings(newSettings);

		// Update current timer if idle
		if (timerState.status === "idle") {
			const duration = getDurationForSessionType(
				timerState.sessionType,
				newSettings.workDuration,
				newSettings.breakDuration,
				newSettings.longBreakDuration
			);

			setTimerState((prev) => ({
				...prev,
				remainingTime: duration * 60,
			}));
		}
	};

	return {
		timerState,
		settings,
		startTimer,
		pauseTimer,
		resetTimer,
		skipSession,
		updateSettings,
	};
};
