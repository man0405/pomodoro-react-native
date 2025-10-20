import AsyncStorage from "@react-native-async-storage/async-storage";
import { PomodoroSession, PomodoroSettings, DailyStats } from "../types";

const STORAGE_KEYS = {
	SESSIONS: "pomodoro_sessions",
	SETTINGS: "pomodoro_settings",
	DAILY_STATS: "daily_stats",
};

const DEFAULT_SETTINGS: PomodoroSettings = {
	workDuration: 25,
	breakDuration: 5,
	longBreakDuration: 15,
	sessionsUntilLongBreak: 4,
};

export const StorageUtils = {
	// Settings
	async getSettings(): Promise<PomodoroSettings> {
		try {
			const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
			return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
		} catch (error) {
			console.error("Error getting settings:", error);
			return DEFAULT_SETTINGS;
		}
	},

	async saveSettings(settings: PomodoroSettings): Promise<void> {
		try {
			await AsyncStorage.setItem(
				STORAGE_KEYS.SETTINGS,
				JSON.stringify(settings)
			);
		} catch (error) {
			console.error("Error saving settings:", error);
		}
	},

	// Sessions
	async getSessions(): Promise<PomodoroSession[]> {
		try {
			const sessions = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
			return sessions ? JSON.parse(sessions) : [];
		} catch (error) {
			console.error("Error getting sessions:", error);
			return [];
		}
	},

	async saveSession(session: PomodoroSession): Promise<void> {
		try {
			const sessions = await this.getSessions();
			sessions.push(session);
			await AsyncStorage.setItem(
				STORAGE_KEYS.SESSIONS,
				JSON.stringify(sessions)
			);
		} catch (error) {
			console.error("Error saving session:", error);
		}
	},

	// Daily Stats
	async getDailyStats(date?: string): Promise<DailyStats[]> {
		try {
			const stats = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS);
			const allStats: DailyStats[] = stats ? JSON.parse(stats) : [];

			if (date) {
				return allStats.filter((stat) => stat.date === date);
			}

			return allStats;
		} catch (error) {
			console.error("Error getting daily stats:", error);
			return [];
		}
	},

	async updateDailyStats(session: PomodoroSession): Promise<void> {
		try {
			const date = new Date(session.startTime).toISOString().split("T")[0];
			const allStats = await this.getDailyStats();

			let dailyStats = allStats.find((stat) => stat.date === date);

			if (!dailyStats) {
				dailyStats = {
					date,
					completedSessions: 0,
					totalWorkTime: 0,
					totalBreakTime: 0,
				};
				allStats.push(dailyStats);
			}

			if (session.completed) {
				dailyStats.completedSessions++;

				if (session.type === "work") {
					dailyStats.totalWorkTime += session.duration;
				} else {
					dailyStats.totalBreakTime += session.duration;
				}
			}

			await AsyncStorage.setItem(
				STORAGE_KEYS.DAILY_STATS,
				JSON.stringify(allStats)
			);
		} catch (error) {
			console.error("Error updating daily stats:", error);
		}
	},

	async clearAllData(): Promise<void> {
		try {
			await AsyncStorage.multiRemove([
				STORAGE_KEYS.SESSIONS,
				STORAGE_KEYS.SETTINGS,
				STORAGE_KEYS.DAILY_STATS,
			]);
		} catch (error) {
			console.error("Error clearing all data:", error);
		}
	},
};
