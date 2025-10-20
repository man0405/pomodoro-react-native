import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LineChart, BarChart } from "react-native-chart-kit";
import { StorageUtils } from "../utils/storage";
import { DailyStats, PomodoroSession } from "../types";

const screenWidth = Dimensions.get("window").width;

export const HistoryScreen: React.FC = () => {
	const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
	const [sessions, setSessions] = useState<PomodoroSession[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
		"week"
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			const [statsData, sessionsData] = await Promise.all([
				StorageUtils.getDailyStats(),
				StorageUtils.getSessions(),
			]);

			setDailyStats(statsData);
			setSessions(sessionsData.filter((session) => session.completed));
			setLoading(false);
		} catch (error) {
			console.error("Error loading history data:", error);
			setLoading(false);
		}
	};

	const getFilteredStats = () => {
		const now = new Date();
		const daysToShow = selectedPeriod === "week" ? 7 : 30;
		const startDate = new Date(now);
		startDate.setDate(startDate.getDate() - daysToShow + 1);

		const filtered = dailyStats.filter((stat) => {
			const statDate = new Date(stat.date);
			return statDate >= startDate && statDate <= now;
		});

		// Fill missing days with zero data
		const filledData: DailyStats[] = [];
		for (let i = 0; i < daysToShow; i++) {
			const date = new Date(startDate);
			date.setDate(date.getDate() + i);
			const dateString = date.toISOString().split("T")[0];

			const existingStat = filtered.find((stat) => stat.date === dateString);
			filledData.push(
				existingStat || {
					date: dateString,
					completedSessions: 0,
					totalWorkTime: 0,
					totalBreakTime: 0,
				}
			);
		}

		return filledData;
	};

	const getTotalStats = () => {
		const completedSessions = sessions.length;
		const totalWorkTime = sessions
			.filter((session) => session.type === "work")
			.reduce((sum, session) => sum + session.duration, 0);
		const totalBreakTime = sessions
			.filter((session) => session.type === "break")
			.reduce((sum, session) => sum + session.duration, 0);

		return {
			completedSessions,
			totalWorkTime,
			totalBreakTime,
		};
	};

	const renderChart = () => {
		const filteredStats = getFilteredStats();

		if (filteredStats.length === 0) {
			return (
				<View style={styles.emptyChart}>
					<Text style={styles.emptyChartText}>No data available</Text>
				</View>
			);
		}

		const chartData = {
			labels: filteredStats.map((stat) => {
				const date = new Date(stat.date);
				return selectedPeriod === "week"
					? date.toLocaleDateString("en", { weekday: "short" })
					: date.getDate().toString();
			}),
			datasets: [
				{
					data: filteredStats.map((stat) => stat.completedSessions),
					color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // red
					strokeWidth: 2,
				},
			],
		};

		const workTimeData = {
			labels: filteredStats.map((stat) => {
				const date = new Date(stat.date);
				return selectedPeriod === "week"
					? date.toLocaleDateString("en", { weekday: "short" })
					: date.getDate().toString();
			}),
			datasets: [
				{
					data: filteredStats.map(
						(stat) => Math.round((stat.totalWorkTime / 60) * 10) / 10
					), // Convert to hours
				},
			],
		};

		return (
			<View style={styles.chartsContainer}>
				<View style={styles.chartSection}>
					<Text style={styles.chartTitle}>Sessions Completed</Text>
					<LineChart
						data={chartData}
						width={screenWidth - 32}
						height={200}
						chartConfig={{
							backgroundColor: "#ffffff",
							backgroundGradientFrom: "#ffffff",
							backgroundGradientTo: "#ffffff",
							decimalPlaces: 0,
							color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: "4",
								strokeWidth: "2",
								stroke: "#ef4444",
							},
						}}
						bezier
						style={styles.chart}
					/>
				</View>

				<View style={styles.chartSection}>
					<Text style={styles.chartTitle}>Work Hours</Text>
					<BarChart
						data={workTimeData}
						width={screenWidth - 32}
						height={200}
						yAxisLabel=""
						yAxisSuffix="h"
						chartConfig={{
							backgroundColor: "#ffffff",
							backgroundGradientFrom: "#ffffff",
							backgroundGradientTo: "#ffffff",
							decimalPlaces: 1,
							color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
							style: {
								borderRadius: 16,
							},
						}}
						style={styles.chart}
					/>
				</View>
			</View>
		);
	};

	const totalStats = getTotalStats();

	if (loading) {
		return (
			<SafeAreaView style={styles.container}>
				<View style={styles.loadingContainer}>
					<Text style={styles.loadingText}>Loading...</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Statistics</Text>
			</View>

			<ScrollView style={styles.content}>
				{/* Summary Stats */}
				<View style={styles.summaryContainer}>
					<View style={styles.statCard}>
						<Text style={styles.statValue}>{totalStats.completedSessions}</Text>
						<Text style={styles.statLabel}>Total Sessions</Text>
					</View>

					<View style={styles.statCard}>
						<Text style={styles.statValue}>
							{Math.round((totalStats.totalWorkTime / 60) * 10) / 10}h
						</Text>
						<Text style={styles.statLabel}>Work Time</Text>
					</View>

					<View style={styles.statCard}>
						<Text style={styles.statValue}>
							{Math.round((totalStats.totalBreakTime / 60) * 10) / 10}h
						</Text>
						<Text style={styles.statLabel}>Break Time</Text>
					</View>
				</View>

				{/* Period Selection */}
				<View style={styles.periodContainer}>
					<TouchableOpacity
						style={[
							styles.periodButton,
							selectedPeriod === "week" && styles.periodButtonActive,
						]}
						onPress={() => setSelectedPeriod("week")}
					>
						<Text
							style={[
								styles.periodButtonText,
								selectedPeriod === "week" && styles.periodButtonTextActive,
							]}
						>
							7 Days
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.periodButton,
							selectedPeriod === "month" && styles.periodButtonActive,
						]}
						onPress={() => setSelectedPeriod("month")}
					>
						<Text
							style={[
								styles.periodButtonText,
								selectedPeriod === "month" && styles.periodButtonTextActive,
							]}
						>
							30 Days
						</Text>
					</TouchableOpacity>
				</View>

				{/* Charts */}
				{renderChart()}

				{/* Recent Sessions */}
				<View style={styles.recentSessions}>
					<Text style={styles.sectionTitle}>Recent Sessions</Text>
					{sessions
						.slice(-5)
						.reverse()
						.map((session, index) => (
							<View key={session.id} style={styles.sessionItem}>
								<View style={styles.sessionInfo}>
									<Text style={styles.sessionType}>
										{session.type === "work" ? "🍅" : "☕"}{" "}
										{session.type === "work" ? "Work" : "Break"}
									</Text>
									<Text style={styles.sessionDate}>
										{new Date(session.startTime).toLocaleDateString()}
									</Text>
								</View>
								<Text style={styles.sessionDuration}>
									{session.duration}min
								</Text>
							</View>
						))}

					{sessions.length === 0 && (
						<Text style={styles.emptyText}>
							No completed sessions yet. Start your first Pomodoro!
						</Text>
					)}
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
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		fontSize: 16,
		color: "#6b7280",
	},
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e5e7eb",
		backgroundColor: "#ffffff",
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#1f2937",
		textAlign: "center",
	},
	content: {
		flex: 1,
	},
	summaryContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingTop: 16,
		gap: 12,
	},
	statCard: {
		flex: 1,
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 16,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	statValue: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1f2937",
	},
	statLabel: {
		fontSize: 12,
		color: "#6b7280",
		marginTop: 4,
	},
	periodContainer: {
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 16,
		gap: 8,
	},
	periodButton: {
		flex: 1,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		backgroundColor: "#f3f4f6",
		alignItems: "center",
	},
	periodButtonActive: {
		backgroundColor: "#ef4444",
	},
	periodButtonText: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "500",
	},
	periodButtonTextActive: {
		color: "#ffffff",
	},
	chartsContainer: {
		paddingHorizontal: 16,
	},
	chartSection: {
		marginBottom: 24,
	},
	chartTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1f2937",
		marginBottom: 8,
	},
	chart: {
		borderRadius: 16,
	},
	emptyChart: {
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: 16,
		marginHorizontal: 16,
	},
	emptyChartText: {
		fontSize: 16,
		color: "#6b7280",
	},
	recentSessions: {
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
	sessionItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#f3f4f6",
	},
	sessionInfo: {
		flex: 1,
	},
	sessionType: {
		fontSize: 16,
		color: "#1f2937",
		fontWeight: "500",
	},
	sessionDate: {
		fontSize: 12,
		color: "#6b7280",
	},
	sessionDuration: {
		fontSize: 14,
		color: "#6b7280",
		fontWeight: "600",
	},
	emptyText: {
		fontSize: 14,
		color: "#6b7280",
		textAlign: "center",
		paddingVertical: 24,
	},
});
