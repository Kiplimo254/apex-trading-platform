import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { dashboardAPI, transactionAPI } from "@/lib/api";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, transactionsData] = await Promise.all([
        dashboardAPI.getStats(),
        transactionAPI.getUserTransactions(),
      ]);

      setStats(statsData.data);
      setTransactions(transactionsData.data?.transactions?.slice(0, 5) || []); // Get last 5, with fallback
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      label: "Total Balance",
      value: `$${stats?.balance?.toLocaleString() || '0.00'}`,
      icon: Wallet,
      change: "+12.5%",
      positive: true,
    },
    {
      label: "Total Profit",
      value: `$${stats?.totalProfit?.toLocaleString() || '0.00'}`,
      icon: TrendingUp,
      change: "+8.2%",
      positive: true,
    },
    {
      label: "Total Deposits",
      value: `$${stats?.totalDeposits?.toLocaleString() || '0.00'}`,
      icon: ArrowDownToLine,
      change: "+5.0%",
      positive: true,
    },
    {
      label: "Total Withdrawals",
      value: `$${stats?.totalWithdrawals?.toLocaleString() || '0.00'}`,
      icon: ArrowUpFromLine,
      change: "+3.1%",
      positive: true,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-primary" />;
      case "FAILED":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "text-success";
      case "WITHDRAWAL":
        return "text-destructive";
      case "PROFIT":
        return "text-primary";
      default:
        return "text-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your investments today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-xl p-6 hover:shadow-gold transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span
                  className={`text-sm font-medium ${stat.positive ? "text-success" : "text-destructive"
                    }`}
                >
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">
                Recent Transactions
              </h2>
            </div>

            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(tx.status)}
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {tx.type.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.method || 'N/A'} • {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${getTransactionTypeColor(
                        tx.type
                      )}`}
                    >
                      {tx.type === "WITHDRAWAL" ? "-" : "+"}
                      ${tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No transactions yet
                </p>
              )}
            </div>
          </div>

          {/* Active Investments */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground">
                Active Investments
              </h2>
              <Link to="/dashboard/investments">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No active investments
              </p>
              <Link to="/dashboard/investments">
                <Button variant="hero">Start Investing</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/dashboard/deposit">
              <Button variant="hero" className="w-full h-auto py-4 flex-col gap-2">
                <ArrowDownToLine className="w-6 h-6" />
                <span>Deposit</span>
              </Button>
            </Link>
            <Link to="/dashboard/withdraw">
              <Button variant="hero-outline" className="w-full h-auto py-4 flex-col gap-2">
                <ArrowUpFromLine className="w-6 h-6" />
                <span>Withdraw</span>
              </Button>
            </Link>
            <Link to="/dashboard/investments">
              <Button variant="glass" className="w-full h-auto py-4 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Invest</span>
              </Button>
            </Link>
            <Link to="/dashboard/referrals">
              <Button variant="glass" className="w-full h-auto py-4 flex-col gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Refer</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
