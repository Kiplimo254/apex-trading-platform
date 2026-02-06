import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Investment {
    id: string;
    amount: number;
    dailyReturn: number;
    totalEarned: number;
    startDate: string;
    endDate: string;
    status: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
    plan: {
        id: string;
        name: string;
        dailyReturnRate: number;
        durationDays: number;
    };
}

const InvestmentManagement = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchInvestments();
    }, [statusFilter]);

    const fetchInvestments = async () => {
        try {
            const token = localStorage.getItem("token");
            let url = "http://localhost:5000/api/admin/investments";
            if (statusFilter) url += `?status=${statusFilter}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setInvestments(data.data.investments);
            }
        } catch (error) {
            console.error("Error fetching investments:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            ACTIVE: "default",
            COMPLETED: "secondary",
            CANCELLED: "destructive",
        };

        return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
    };

    const calculateProgress = (startDate: string, endDate: string) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const now = Date.now();
        const progress = ((now - start) / (end - start)) * 100;
        return Math.min(Math.max(progress, 0), 100).toFixed(0);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">
                            Investment Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Monitor all platform investments
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-4 glass">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-xs">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="">All Statuses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Investments Table */}
                <Card className="glass">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Daily Return</TableHead>
                                <TableHead>Total Earned</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>End Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : investments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No investments found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                investments.map((investment) => (
                                    <TableRow key={investment.id}>
                                        <TableCell className="font-medium">
                                            {investment.user.email}
                                        </TableCell>
                                        <TableCell>{investment.plan.name}</TableCell>
                                        <TableCell className="font-semibold">
                                            ${investment.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            ${investment.dailyReturn.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-green-500 font-semibold">
                                            ${investment.totalEarned.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-secondary rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{
                                                            width: `${calculateProgress(
                                                                investment.startDate,
                                                                investment.endDate
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {calculateProgress(
                                                        investment.startDate,
                                                        investment.endDate
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(investment.status)}</TableCell>
                                        <TableCell>
                                            {new Date(investment.endDate).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default InvestmentManagement;
