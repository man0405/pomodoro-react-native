import * as Notifications from "expo-notifications";
import * as Haptics from "expo-haptics";
import { SessionType } from "../types";

// Configure notifications to show always
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

export const NotificationUtils = {
	async requestPermissions(): Promise<boolean> {
		try {
			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== "granted") {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			return finalStatus === "granted";
		} catch (error) {
			console.error("Error requesting notification permissions:", error);
			return false;
		}
	},

	// Create persistent notification showing countdown
	async createOngoingNotification(
		sessionType: SessionType,
		remainingTime: number // in seconds
	): Promise<string | null> {
		try {
			const hasPermission = await this.requestPermissions();
			if (!hasPermission) return null;

			const minutes = Math.floor(remainingTime / 60);
			const seconds = remainingTime % 60;
			const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
				.toString()
				.padStart(2, "0")}`;

			const notificationId = await Notifications.scheduleNotificationAsync({
				content: {
					title: `${this.getSessionEmoji(sessionType)} ${this.getSessionLabel(
						sessionType
					)} - ${timeString}`,
					body: "Timer is running...",
					sound: false,
					sticky: true,
					priority: "high",
					categoryIdentifier: "timer",
				},
				trigger: null, // Show immediately
			});

			return notificationId;
		} catch (error) {
			console.error("Error creating ongoing notification:", error);
			return null;
		}
	},

	// Update the ongoing notification with new time
	async updateOngoingNotification(
		notificationId: string,
		sessionType: SessionType,
		remainingTime: number // in seconds
	): Promise<void> {
		try {
			const minutes = Math.floor(remainingTime / 60);
			const seconds = remainingTime % 60;
			const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
				.toString()
				.padStart(2, "0")}`;

			await Notifications.scheduleNotificationAsync({
				identifier: notificationId,
				content: {
					title: `${this.getSessionEmoji(sessionType)} ${this.getSessionLabel(
						sessionType
					)} - ${timeString}`,
					body: "Timer is running...",
					sound: false,
					sticky: true,
					priority: "high",
					categoryIdentifier: "timer",
				},
				trigger: null,
			});
		} catch (error) {
			console.error("Error updating ongoing notification:", error);
		}
	},

	async scheduleTimerNotification(
		sessionType: SessionType,
		duration: number // in minutes
	): Promise<string | null> {
		try {
			const hasPermission = await this.requestPermissions();
			if (!hasPermission) return null;

			const notificationId = await Notifications.scheduleNotificationAsync({
				content: {
					title: this.getNotificationTitle(sessionType),
					body: this.getNotificationBody(sessionType),
					sound: true,
					vibrate: [0, 250, 250, 250],
					priority: "high",
				},
				trigger: {
					type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
					seconds: duration * 60,
				},
			});

			return notificationId;
		} catch (error) {
			console.error("Error scheduling notification:", error);
			return null;
		}
	},

	// Show completion notification
	async showCompletionNotification(sessionType: SessionType): Promise<void> {
		try {
			const hasPermission = await this.requestPermissions();
			if (!hasPermission) return;

			await Notifications.scheduleNotificationAsync({
				content: {
					title: this.getNotificationTitle(sessionType),
					body: this.getNotificationBody(sessionType),
					sound: true,
					vibrate: [0, 250, 250, 250],
					priority: "high",
					categoryIdentifier: "completion",
				},
				trigger: null, // Show immediately
			});
		} catch (error) {
			console.error("Error showing completion notification:", error);
		}
	},

	async cancelNotification(notificationId: string): Promise<void> {
		try {
			await Notifications.cancelScheduledNotificationAsync(notificationId);
		} catch (error) {
			console.error("Error canceling notification:", error);
		}
	},

	async cancelAllNotifications(): Promise<void> {
		try {
			await Notifications.cancelAllScheduledNotificationsAsync();
		} catch (error) {
			console.error("Error canceling all notifications:", error);
		}
	},

	async triggerHapticFeedback(): Promise<void> {
		try {
			await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		} catch (error) {
			console.error("Error triggering haptic feedback:", error);
		}
	},

	getSessionEmoji(sessionType: SessionType): string {
		switch (sessionType) {
			case "work":
				return "🍅";
			case "break":
				return "☕";
			case "longBreak":
				return "🎉";
			default:
				return "⏰";
		}
	},

	getSessionLabel(sessionType: SessionType): string {
		switch (sessionType) {
			case "work":
				return "Work Session";
			case "break":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Session";
		}
	},

	getNotificationTitle(sessionType: SessionType): string {
		switch (sessionType) {
			case "work":
				return "🍅 Work session completed!";
			case "break":
				return "☕ Break time is over!";
			case "longBreak":
				return "🎉 Long break finished!";
			default:
				return "Pomodoro session completed!";
		}
	},

	getNotificationBody(sessionType: SessionType): string {
		switch (sessionType) {
			case "work":
				return "Great job! Time for a well-deserved break.";
			case "break":
				return "Ready to get back to work? Let's stay focused!";
			case "longBreak":
				return "Feeling refreshed? Time to start a new work session!";
			default:
				return "Your session has ended. What's next?";
		}
	},
};
