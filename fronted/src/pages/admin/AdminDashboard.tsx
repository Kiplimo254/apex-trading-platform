import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
    Users,
    DollarSign,
    TrendingUp,
    ArrowDownToLine,
    ArrowUpFromLine,
    Clock,
} from "lucide-react";

interface PlatformStats {
    users: {
        total: number;
        active: number;
    };
    transactions: {
        totalDeposits: number;
        totalWithdrawals: number;
        pending: number;
    };
    investments: {
        total: number;
        active: number;
    };
    platformRevenue: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    const statCards = [
        {
            label: "Total Users",
            value: stats?.users.total || 0,
            subValue: `${stats?.users.active || 0} active`,
            icon: Users,
            color: "text-blue-500",
        },
        {
            label: "Platform Revenue",
            value: `$${stats?.platformRevenue.toLocaleString() || 0}`,
            subValue: "Total earnings",
            icon: DollarSign,
            color: "text-green-500",
        },
        {
            label: "Total Deposits",
            value: `$${stats?.transactions.totalDeposits.toLocaleString() || 0}`,
            subValue: "All time",
            icon: ArrowDownToLine,
            color: "text-emerald-500",
        },
        {
            label: "Total Withdrawals",
            value: `$${stats?.transactions.totalWithdrawals.toLocaleString() || 0}`,
            subValue: "All time",
            icon: ArrowUpFromLine,
            color: "text-orange-500",
        },
        {
            label: "Active Investments",
            value: stats?.investments.active || 0,
            subValue: `${stats?.investments.total || 0} total`,
            icon: TrendingUp,
            color: "text-purple-500",
        },
        {
            label: "Pending Transactions",
            value: stats?.transactions.pending || 0,
            subValue: "Awaiting approval",
            icon: Clock,
            color: "text-yellow-500",
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Platform overview and statistics
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="p-6 glass hover:shadow-gold transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-foreground">
                                    {stat.value}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                                <p className="text-xs text-muted-foreground mt-2">{stat.subValue}</p>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <Card className="p-6 glass">
                    <h2 className="text-xl font-display font-bold text-foreground mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <a
                            href="/admin/users"
                            className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center"
                        >
                            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Manage Users</p>
                        </a>
                        <a
                            href="/admin/transactions"
                            className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center"
                        >
                            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Pending Transactions</p>
                        </a>
                        <a
                            href="/admin/investments"
                            className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center"
                        >
                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">View Investments</p>
                        </a>
                        <a
                            href="/admin/analytics"
                            className="p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-center"
                        >
                            <DollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                            <p className="font-medium">Analytics</p>
                        </a>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
