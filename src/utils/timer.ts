export const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
		.toString()
		.padStart(2, "0")}`;
};

export const generateId = (): string => {
	return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const getNextSessionType = (
	currentType: "work" | "break" | "longBreak",
	sessionCount: number,
	sessionsUntilLongBreak: number = 4
): "work" | "break" | "longBreak" => {
	if (currentType === "work") {
		return sessionCount % sessionsUntilLongBreak === 0 ? "longBreak" : "break";
	}
	return "work";
};

export const getDurationForSessionType = (
	sessionType: "work" | "break" | "longBreak",
	workDuration: number = 25,
	breakDuration: number = 5,
	longBreakDuration: number = 15
): number => {
	switch (sessionType) {
		case "work":
			return workDuration;
		case "break":
			return breakDuration;
		case "longBreak":
			return longBreakDuration;
		default:
			return workDuration;
	}
};

export const getSessionTypeLabel = (
	sessionType: "work" | "break" | "longBreak"
): string => {
	switch (sessionType) {
		case "work":
			return "Work Time";
		case "break":
			return "Short Break";
		case "longBreak":
			return "Long Break";
		default:
			return "Session";
	}
};

export const getSessionTypeColor = (
	sessionType: "work" | "break" | "longBreak"
): string => {
	switch (sessionType) {
		case "work":
			return "bg-red-500";
		case "break":
			return "bg-green-500";
		case "longBreak":
			return "bg-blue-500";
		default:
			return "bg-gray-500";
	}
};
