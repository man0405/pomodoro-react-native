import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { TimerStatus } from "../types";

interface ControlButtonsProps {
	status: TimerStatus;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
	onSkip: () => void;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
	status,
	onStart,
	onPause,
	onReset,
	onSkip,
}) => {
	const renderPrimaryButton = () => {
		if (status === "idle" || status === "paused") {
			return (
				<TouchableOpacity
					style={[styles.button, styles.primaryButton]}
					onPress={onStart}
				>
					<Text style={styles.primaryButtonText}>START</Text>
				</TouchableOpacity>
			);
		}

		if (status === "running") {
			return (
				<TouchableOpacity
					style={[styles.button, styles.pauseButton]}
					onPress={onPause}
				>
					<Text style={styles.pauseButtonText}>PAUSE</Text>
				</TouchableOpacity>
			);
		}

		return (
			<TouchableOpacity
				style={[styles.button, styles.primaryButton]}
				onPress={onReset}
			>
				<Text style={styles.primaryButtonText}>NEW SESSION</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.primaryContainer}>{renderPrimaryButton()}</View>

			<View style={styles.secondaryContainer}>
				<TouchableOpacity
					style={[styles.button, styles.secondaryButton]}
					onPress={onReset}
					disabled={status === "idle"}
				>
					<Text
						style={[
							styles.secondaryButtonText,
							status === "idle" && styles.disabledText,
						]}
					>
						RESET
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.button, styles.secondaryButton]}
					onPress={onSkip}
					disabled={status === "idle"}
				>
					<Text
						style={[
							styles.secondaryButtonText,
							status === "idle" && styles.disabledText,
						]}
					>
						SKIP
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 32,
		paddingVertical: 16,
	},
	primaryContainer: {
		marginBottom: 16,
	},
	secondaryContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	button: {
		paddingVertical: 16,
		paddingHorizontal: 32,
		borderRadius: 30,
		alignItems: "center",
		minWidth: 120,
	},
	primaryButton: {
		backgroundColor: "#ef4444",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	pauseButton: {
		backgroundColor: "#f59e0b",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	secondaryButton: {
		backgroundColor: "transparent",
		borderWidth: 2,
		borderColor: "#d1d5db",
	},
	primaryButtonText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "bold",
	},
	pauseButtonText: {
		color: "#ffffff",
		fontSize: 18,
		fontWeight: "bold",
	},
	secondaryButtonText: {
		color: "#6b7280",
		fontSize: 16,
		fontWeight: "600",
	},
	disabledText: {
		color: "#d1d5db",
	},
});
