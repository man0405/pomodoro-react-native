import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TimerDisplay } from "../components/TimerDisplay";
import { ControlButtons } from "../components/ControlButtons";
import { SessionInfo } from "../components/SessionInfo";
import { useTimerContext } from "../context/TimerContext";
import { getNextSessionType } from "../utils/timer";

export const TimerScreen: React.FC = () => {
	const {
		timerState,
		settings,
		startTimer,
		pauseTimer,
		resetTimer,
		skipSession,
	} = useTimerContext();

	const nextSessionType = getNextSessionType(
		timerState.sessionType,
		timerState.sessionCount + 1,
		settings.sessionsUntilLongBreak
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<SessionInfo
					sessionCount={timerState.sessionCount}
					sessionType={timerState.sessionType}
					nextSessionType={
						timerState.status !== "completed" ? nextSessionType : undefined
					}
				/>

				<TimerDisplay
					remainingTime={timerState.remainingTime}
					sessionType={timerState.sessionType}
					isRunning={timerState.status === "running"}
				/>

				<ControlButtons
					status={timerState.status}
					onStart={startTimer}
					onPause={pauseTimer}
					onReset={resetTimer}
					onSkip={skipSession}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9fafb",
	},
	content: {
		flex: 1,
		justifyContent: "space-between",
	},
});
