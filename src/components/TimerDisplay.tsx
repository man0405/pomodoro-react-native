import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatTime, getSessionTypeLabel } from "../utils/timer";
import { SessionType } from "../types";

interface TimerDisplayProps {
	remainingTime: number;
	sessionType: SessionType;
	isRunning: boolean;
}

const getSessionTypeColor = (sessionType: SessionType): string => {
	switch (sessionType) {
		case "work":
			return "#ef4444"; // red-500
		case "break":
			return "#22c55e"; // green-500
		case "longBreak":
			return "#3b82f6"; // blue-500
		default:
			return "#6b7280"; // gray-500
	}
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
	remainingTime,
	sessionType,
	isRunning,
}) => {
	const sessionColor = getSessionTypeColor(sessionType);
	const label = getSessionTypeLabel(sessionType);

	return (
		<View style={styles.container}>
			<Text style={styles.label}>{label}</Text>

			<View
				style={[
					styles.circle,
					{
						backgroundColor: isRunning ? sessionColor : "#e5e7eb",
						borderColor: isRunning ? sessionColor + "33" : "#d1d5db",
					},
				]}
			>
				<Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
			</View>

			<View style={styles.statusContainer}>
				<View
					style={[
						styles.statusDot,
						{ backgroundColor: isRunning ? sessionColor : "#9ca3af" },
					]}
				/>
				<Text style={styles.statusText}>
					{isRunning ? "Running" : "Paused"}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 32,
	},
	label: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#1f2937",
	},
	circle: {
		width: 256,
		height: 256,
		borderRadius: 128,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 8,
	},
	timeText: {
		fontSize: 48,
		fontWeight: "bold",
		color: "#ffffff",
	},
	statusContainer: {
		marginTop: 16,
		flexDirection: "row",
		alignItems: "center",
	},
	statusDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 8,
	},
	statusText: {
		fontSize: 18,
		color: "#4b5563",
	},
});
