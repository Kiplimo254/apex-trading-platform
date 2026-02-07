import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, DollarSign, TrendingUp, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    totalCommissionPaid: number;
    pendingCommission: number;
}

interface Referral {
    id: string;
    referrerId: string;
    referrerName: string;
    referrerEmail: string;
    referredUserId: string;
    referredUserName: string;
    referredUserEmail: string;
    commissionEarned: number;
    status: string;
    createdAt: string;
}

const ReferralManagement = () => {
    const [stats, setStats] = useState<ReferralStats | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/admin/referrals", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setReferrals(data.data || []);

                // Calculate stats
                const totalReferrals = data.data?.length || 0;
                const activeReferrals = data.data?.filter((r: Referral) => r.status === 'ACTIVE').length || 0;
                const totalCommissionPaid = data.data?.reduce((sum: number, r: Referral) => sum + r.commissionEarned, 0) || 0;

                setStats({
                    totalReferrals,
                    activeReferrals,
                    totalCommissionPaid,
                    pendingCommission: 0,
                });
            }
        } catch (error) {
            console.error("Error fetching referrals:", error);
            toast({
                title: "Error",
                description: "Failed to fetch referrals",
                variant: "destructive",
            });
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

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Referral Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Track and manage user referrals and commissions
                    </p>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground">
                                {stats.totalReferrals}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Total Referrals</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {stats.activeReferrals} active
                            </p>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground">
                                {stats.activeReferrals}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Active Referrals</p>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground">
                                ${stats.totalCommissionPaid.toFixed(2)}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Commission Paid</p>
                        </Card>

                        <Card className="p-6 glass">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground">
                                ${stats.pendingCommission.toFixed(2)}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Pending Commission</p>
                        </Card>
                    </div>
                )}

                {/* Referrals Table */}
                <Card className="glass">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-display font-bold text-foreground">
                            All Referrals
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {referrals.length === 0 ? (
                            <div className="p-12 text-center">
                                <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    No Referrals Yet
                                </h3>
                                <p className="text-muted-foreground">
                                    Referrals will appear here when users start referring others
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Referrer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Referred User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Commission
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {referrals.map((referral) => (
                                        <tr key={referral.id} className="hover:bg-muted/50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {referral.referrerName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {referral.referrerEmail}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {referral.referredUserName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {referral.referredUserEmail}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-green-600">
                                                    ${referral.commissionEarned.toFixed(2)}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 text-xs font-semibold rounded ${referral.status === "ACTIVE"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                >
                                                    {referral.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {new Date(referral.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default ReferralManagement;
