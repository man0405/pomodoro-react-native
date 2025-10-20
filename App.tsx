import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// import './global.css';
import { TimerScreen } from "./src/screens/TimerScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { FloatingTimer } from "./src/components/FloatingTimer";
import { TimerProvider, useTimerContext } from "./src/context/TimerContext";

type TabType = "timer" | "history" | "settings";

const AppContent: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>("timer");
	const [showSettings, setShowSettings] = useState(false);
	const [showFloatingTimer, setShowFloatingTimer] = useState(false);
	const { settings, updateSettings, timerState, pauseTimer, resetTimer } =
		useTimerContext();

	// Handle floating timer visibility
	const handleTabChange = (newTab: TabType) => {
		// Show floating timer if we're leaving timer tab and timer is running
		if (
			activeTab === "timer" &&
			newTab !== "timer" &&
			timerState.status === "running"
		) {
			setShowFloatingTimer(true);
		}
		// Hide floating timer if we're going back to timer tab
		if (newTab === "timer") {
			setShowFloatingTimer(false);
		}
		setActiveTab(newTab);
	};

	const handleFloatingTimerPause = () => {
		pauseTimer();
		setShowFloatingTimer(false);
		setActiveTab("timer");
	};

	const handleFloatingTimerClose = () => {
		setShowFloatingTimer(false);
		setActiveTab("timer");
	};

	const renderContent = () => {
		if (showSettings) {
			return (
				<SettingsScreen
					settings={settings}
					onUpdateSettings={updateSettings}
					onClose={() => setShowSettings(false)}
				/>
			);
		}

		switch (activeTab) {
			case "timer":
				return <TimerScreen />;
			case "history":
				return <HistoryScreen />;
			default:
				return <TimerScreen />;
		}
	};

	const renderTabBar = () => {
		if (showSettings) return null;

		return (
			<View style={styles.tabBar}>
				<TouchableOpacity
					style={[styles.tabItem, activeTab === "timer" && styles.activeTab]}
					onPress={() => handleTabChange("timer")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "timer" && styles.activeTabText,
						]}
					>
						Timer
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tabItem, activeTab === "history" && styles.activeTab]}
					onPress={() => handleTabChange("history")}
				>
					<Text
						style={[
							styles.tabText,
							activeTab === "history" && styles.activeTabText,
						]}
					>
						Stats
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.tabItem}
					onPress={() => setShowSettings(true)}
				>
					<Text style={styles.tabText}>Settings</Text>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<StatusBar style="auto" />
				{renderContent()}
				{renderTabBar()}

				{/* Floating Timer Overlay */}
				<FloatingTimer
					remainingTime={timerState.remainingTime}
					sessionType={timerState.sessionType}
					isVisible={showFloatingTimer}
					onPause={handleFloatingTimerPause}
					onClose={handleFloatingTimerClose}
				/>
			</View>
		</SafeAreaProvider>
	);
};

export default function App() {
	return (
		<TimerProvider>
			<AppContent />
		</TimerProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9fafb",
	},
	tabBar: {
		flexDirection: "row",
		backgroundColor: "#ffffff",
		borderTopWidth: 1,
		borderTopColor: "#e5e7eb",
		paddingBottom: 20,
		paddingTop: 12,
	},
	tabItem: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 8,
	},
	activeTab: {
		borderTopWidth: 2,
		borderTopColor: "#ef4444",
	},
	tabText: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
	},
	activeTabText: {
		color: "#ef4444",
		fontWeight: "600",
	},
});
