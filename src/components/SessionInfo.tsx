import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SessionType } from "../types";

interface SessionInfoProps {
	sessionCount: number;
	sessionType: SessionType;
	nextSessionType?: SessionType;
}

const getSessionTypeEmoji = (sessionType: SessionType): string => {
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
};

const getSessionTypeLabel = (sessionType: SessionType): string => {
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
};

export const SessionInfo: React.FC<SessionInfoProps> = ({
	sessionCount,
	sessionType,
	nextSessionType,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.currentSession}>
				<Text style={styles.emoji}>{getSessionTypeEmoji(sessionType)}</Text>
				<Text style={styles.sessionText}>Session #{sessionCount}</Text>
			</View>

			{nextSessionType && (
				<View style={styles.nextSession}>
					<Text style={styles.nextLabel}>Next: </Text>
					<Text style={styles.nextEmoji}>
						{getSessionTypeEmoji(nextSessionType)}
					</Text>
					<Text style={styles.nextText}>
						{getSessionTypeLabel(nextSessionType)}
					</Text>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingVertical: 16,
		paddingHorizontal: 20,
	},
	currentSession: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	emoji: {
		fontSize: 24,
		marginRight: 8,
	},
	sessionText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1f2937",
	},
	nextSession: {
		flexDirection: "row",
		alignItems: "center",
	},
	nextLabel: {
		fontSize: 14,
		color: "#6b7280",
	},
	nextEmoji: {
		fontSize: 16,
		marginHorizontal: 4,
	},
	nextText: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
	},
});
