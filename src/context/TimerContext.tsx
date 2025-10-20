import React, { createContext, useContext } from "react";
import { useTimer } from "../utils/useTimer";

interface TimerContextType {
	timerState: ReturnType<typeof useTimer>["timerState"];
	settings: ReturnType<typeof useTimer>["settings"];
	startTimer: ReturnType<typeof useTimer>["startTimer"];
	pauseTimer: ReturnType<typeof useTimer>["pauseTimer"];
	resetTimer: ReturnType<typeof useTimer>["resetTimer"];
	skipSession: ReturnType<typeof useTimer>["skipSession"];
	updateSettings: ReturnType<typeof useTimer>["updateSettings"];
}

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const timerHook = useTimer();

	return (
		<TimerContext.Provider value={timerHook}>{children}</TimerContext.Provider>
	);
};

export const useTimerContext = (): TimerContextType => {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error("useTimerContext must be used within a TimerProvider");
	}
	return context;
};
