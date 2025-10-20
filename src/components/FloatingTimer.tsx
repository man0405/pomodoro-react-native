import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatTime } from "../utils/timer";

interface FloatingTimerProps {
	remainingTime: number;
	sessionType: "work" | "break" | "longBreak";
	isVisible: boolean;
	onPause: () => void;
	onClose: () => void;
}

export const FloatingTimer: React.FC<FloatingTimerProps> = ({
	remainingTime,
	sessionType,
	isVisible,
	onPause,
	onClose,
}) => {
	if (!isVisible) return null;

	const getSessionColor = () => {
		switch (sessionType) {
			case "work":
				return "#ef4444"; // red
			case "break":
				return "#22c55e"; // green
			case "longBreak":
				return "#3b82f6"; // blue
			default:
				return "#6b7280"; // gray
		}
	};

	const getSessionLabel = () => {
		switch (sessionType) {
			case "work":
				return "Work Session";
			case "break":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Timer";
		}
	};

	return (
		<View style={styles.container}>
			<View
				style={[styles.notification, { borderLeftColor: getSessionColor() }]}
			>
				<View style={styles.content}>
					<View style={styles.timerInfo}>
						<Text style={styles.label}>{getSessionLabel()}</Text>
						<Text style={[styles.timer, { color: getSessionColor() }]}>
							{formatTime(remainingTime)}
						</Text>
					</View>

					<View style={styles.controls}>
						<TouchableOpacity
							style={[styles.button, styles.pauseButton]}
							onPress={onPause}
						>
							<Text style={styles.pauseIcon}>⏸</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.closeButton]}
							onPress={onClose}
						>
							<Text style={styles.closeIcon}>✕</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		top: 50,
		left: 16,
		right: 16,
		zIndex: 1000,
	},
	notification: {
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		borderRadius: 12,
		borderLeftWidth: 4,
		paddingHorizontal: 16,
		paddingVertical: 12,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
	},
	content: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	timerInfo: {
		flex: 1,
	},
	label: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "500",
		opacity: 0.8,
	},
	timer: {
		fontSize: 24,
		fontWeight: "bold",
		marginTop: 2,
	},
	controls: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	button: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	pauseButton: {
		backgroundColor: "rgba(255, 255, 255, 0.2)",
	},
	closeButton: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	pauseIcon: {
		color: "#ffffff",
		fontSize: 16,
	},
	closeIcon: {
		color: "#ffffff",
		fontSize: 14,
		fontWeight: "bold",
	},
});
