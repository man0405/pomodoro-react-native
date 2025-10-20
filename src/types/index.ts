export interface PomodoroSession {
	id: string;
	type: "work" | "break";
	duration: number; // in minutes
	startTime: Date;
	endTime?: Date;
	completed: boolean;
}

export interface PomodoroSettings {
	workDuration: number; // in minutes
	breakDuration: number; // in minutes
	longBreakDuration: number; // in minutes
	sessionsUntilLongBreak: number;
}

export interface DailyStats {
	date: string; // YYYY-MM-DD format
	completedSessions: number;
	totalWorkTime: number; // in minutes
	totalBreakTime: number; // in minutes
}

export type TimerStatus = "idle" | "running" | "paused" | "completed";
export type SessionType = "work" | "break" | "longBreak";

export interface TimerState {
	currentSession: PomodoroSession | null;
	remainingTime: number; // in seconds
	status: TimerStatus;
	sessionType: SessionType;
	sessionCount: number;
}
