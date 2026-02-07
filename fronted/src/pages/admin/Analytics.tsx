import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

interface AnalyticsData {
    revenue: {
        today: number;
        week: number;
        month: number;
        year: number;
        growth: number;
    };
    users: {
        total: number;
        newToday: number;
        newWeek: number;
        newMonth: number;
        growth: number;
    };
    transactions: {
        total: number;
        today: number;
        week: number;
        volume: number;
    };
    investments: {
        total: number;
        active: number;
        completed: number;
        totalValue: number;
    };
}

const Analytics = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/admin/analytics", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAnalytics(data.data);
            } else {
                // Mock data for now
                setAnalytics({
                    revenue: {
                        today: 1250,
                        week: 8500,
                        month: 35000,
                        year: 420000,
                        growth: 12.5,
                    },
                    users: {
                        total: 1523,
                        newToday: 12,
                        newWeek: 87,
                        newMonth: 342,
                        growth: 8.3,
                    },
                    transactions: {
                        total: 4521,
                        today: 45,
                        week: 312,
                        volume: 1250000,
                    },
                    investments: {
                        total: 856,
                        active: 623,
                        completed: 233,
                        totalValue: 2500000,
                    },
                });
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
            // Use mock data on error
            setAnalytics({
                revenue: {
                    today: 1250,
                    week: 8500,
                    month: 35000,
                    year: 420000,
                    growth: 12.5,
                },
                users: {
                    total: 1523,
                    newToday: 12,
                    newWeek: 87,
                    newMonth: 342,
                    growth: 8.3,
                },
                transactions: {
                    total: 4521,
                    today: 45,
                    week: 312,
                    volume: 1250000,
                },
                investments: {
                    total: 856,
                    active: 623,
                    completed: 233,
                    totalValue: 2500000,
                },
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Platform performance metrics and insights
                    </p>
                </div>

                {/* Revenue Analytics */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Revenue</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Today</p>
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.revenue.today.toLocaleString()}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.revenue.week.toLocaleString()}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.revenue.month.toLocaleString()}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">This Year</p>
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.revenue.year.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">
                                    {analytics?.revenue.growth}% growth
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* User Analytics */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Users</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Users</p>
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.users.total.toLocaleString()}
                            </h3>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">
                                    {analytics?.users.growth}% growth
                                </span>
                            </div>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">New Today</p>
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.users.newToday}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">New This Week</p>
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.users.newWeek}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">New This Month</p>
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.users.newMonth}
                            </h3>
                        </Card>
                    </div>
                </div>

                {/* Transaction Analytics */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Transactions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.transactions.total.toLocaleString()}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Today</p>
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.transactions.today}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">This Week</p>
                                <BarChart3 className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.transactions.week}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Volume</p>
                                <DollarSign className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.transactions.volume.toLocaleString()}
                            </h3>
                        </Card>
                    </div>
                </div>

                {/* Investment Analytics */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">Investments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total</p>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.investments.total}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Active</p>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.investments.active}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {analytics?.investments.completed}
                            </h3>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">Total Value</p>
                                <DollarSign className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                ${analytics?.investments.totalValue.toLocaleString()}
                            </h3>
                        </Card>
                    </div>
                </div>

                {/* Note */}
                <Card className="p-6 glass bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Analytics Dashboard
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                This page displays platform-wide analytics and performance metrics.
                                Connect to the backend API endpoint <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">/api/admin/analytics</code> for real-time data.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Analytics;
