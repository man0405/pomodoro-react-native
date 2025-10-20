import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	Alert,
	ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PomodoroSettings } from "../types";

interface SettingsScreenProps {
	settings: PomodoroSettings;
	onUpdateSettings: (settings: PomodoroSettings) => void;
	onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
	settings,
	onUpdateSettings,
	onClose,
}) => {
	const [localSettings, setLocalSettings] =
		useState<PomodoroSettings>(settings);

	const handleSave = () => {
		// Validate settings
		if (
			localSettings.workDuration < 1 ||
			localSettings.breakDuration < 1 ||
			localSettings.longBreakDuration < 1 ||
			localSettings.sessionsUntilLongBreak < 1
		) {
			Alert.alert(
				"Invalid Settings",
				"All durations must be at least 1 minute."
			);
			return;
		}

		if (localSettings.sessionsUntilLongBreak > 10) {
			Alert.alert(
				"Invalid Settings",
				"Sessions until long break must be 10 or less."
			);
			return;
		}

		onUpdateSettings(localSettings);
		onClose();
	};

	const handleReset = () => {
		Alert.alert(
			"Reset Settings",
			"Are you sure you want to reset all settings to default values?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Reset",
					style: "destructive",
					onPress: () => {
						const defaultSettings: PomodoroSettings = {
							workDuration: 25,
							breakDuration: 5,
							longBreakDuration: 15,
							sessionsUntilLongBreak: 4,
						};
						setLocalSettings(defaultSettings);
					},
				},
			]
		);
	};

	const renderSettingItem = (
		label: string,
		value: number,
		onChangeText: (text: string) => void,
		unit: string = "min"
	) => (
		<View style={styles.settingItem}>
			<Text style={styles.settingLabel}>{label}</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={value.toString()}
					onChangeText={onChangeText}
					keyboardType="numeric"
					selectTextOnFocus
				/>
				<Text style={styles.unit}>{unit}</Text>
			</View>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.headerButton} onPress={onClose}>
					<Text style={styles.headerButtonText}>Cancel</Text>
				</TouchableOpacity>

				<Text style={styles.title}>Settings</Text>

				<TouchableOpacity style={styles.headerButton} onPress={handleSave}>
					<Text style={[styles.headerButtonText, styles.saveButton]}>Save</Text>
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.content}>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Timer Durations</Text>

					{renderSettingItem(
						"Work Duration",
						localSettings.workDuration,
						(text) =>
							setLocalSettings({
								...localSettings,
								workDuration: parseInt(text) || 0,
							})
					)}

					{renderSettingItem(
						"Short Break Duration",
						localSettings.breakDuration,
						(text) =>
							setLocalSettings({
								...localSettings,
								breakDuration: parseInt(text) || 0,
							})
					)}

					{renderSettingItem(
						"Long Break Duration",
						localSettings.longBreakDuration,
						(text) =>
							setLocalSettings({
								...localSettings,
								longBreakDuration: parseInt(text) || 0,
							})
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Session Settings</Text>

					{renderSettingItem(
						"Work Sessions Until Long Break",
						localSettings.sessionsUntilLongBreak,
						(text) =>
							setLocalSettings({
								...localSettings,
								sessionsUntilLongBreak: parseInt(text) || 0,
							}),
						"sessions"
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Presets</Text>

					<TouchableOpacity
						style={styles.presetButton}
						onPress={() => {
							setLocalSettings({
								workDuration: 25,
								breakDuration: 5,
								longBreakDuration: 15,
								sessionsUntilLongBreak: 4,
							});
						}}
					>
						<Text style={styles.presetButtonText}>
							Classic Pomodoro (25/5/15)
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.presetButton}
						onPress={() => {
							setLocalSettings({
								workDuration: 50,
								breakDuration: 10,
								longBreakDuration: 30,
								sessionsUntilLongBreak: 3,
							});
						}}
					>
						<Text style={styles.presetButtonText}>
							Extended Focus (50/10/30)
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.presetButton}
						onPress={() => {
							setLocalSettings({
								workDuration: 15,
								breakDuration: 3,
								longBreakDuration: 10,
								sessionsUntilLongBreak: 5,
							});
						}}
					>
						<Text style={styles.presetButtonText}>
							Quick Sessions (15/3/10)
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.section}>
					<TouchableOpacity style={styles.resetButton} onPress={handleReset}>
						<Text style={styles.resetButtonText}>Reset to Default</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9fafb",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#ffffff",
	},
	headerButton: {
		paddingVertical: 8,
		paddingHorizontal: 12,
		minWidth: 60,
	},
	headerButtonText: {
		fontSize: 16,
		color: "#6b7280",
	},
	saveButton: {
		color: "#ef4444",
		fontWeight: "600",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1f2937",
	},
	content: {
		flex: 1,
	},
	section: {
		backgroundColor: "#ffffff",
		marginTop: 16,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 12,
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f3f4f6",
	},
	settingLabel: {
		fontSize: 16,
		color: "#374151",
		flex: 1,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#d1d5db",
		borderRadius: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
		fontSize: 16,
		minWidth: 60,
		textAlign: "center",
		color: "#1f2937",
	},
	unit: {
		fontSize: 14,
		color: "#6b7280",
		marginLeft: 8,
	},
	presetButton: {
		backgroundColor: "#f3f4f6",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginBottom: 8,
	},
	presetButtonText: {
		fontSize: 16,
		color: "#374151",
		textAlign: "center",
	},
	resetButton: {
		backgroundColor: "#ef4444",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginTop: 8,
	},
	resetButtonText: {
		fontSize: 16,
		color: "#ffffff",
		textAlign: "center",
		fontWeight: "600",
	},
});
