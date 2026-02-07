import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    method: string | null;
    walletAddress: string | null;
    transactionHash: string | null;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    };
}

const TransactionManagement = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [typeFilter, setTypeFilter] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchTransactions();
    }, [statusFilter, typeFilter]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem("token");
            let url = "http://localhost:5000/api/admin/transactions?";
            if (statusFilter) url += `status=${statusFilter}&`;
            if (typeFilter) url += `type=${typeFilter}`;

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (transactionId: string, status: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/admin/transactions/${transactionId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `Transaction ${status.toLowerCase()} successfully`,
                });
                fetchTransactions();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update transaction status",
                variant: "destructive",
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            PENDING: "secondary",
            COMPLETED: "default",
            FAILED: "destructive",
            CANCELLED: "destructive",
        };

        return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
    };

    const getTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            DEPOSIT: "bg-green-500/10 text-green-500",
            WITHDRAWAL: "bg-orange-500/10 text-orange-500",
            PROFIT: "bg-blue-500/10 text-blue-500",
            REFERRAL_COMMISSION: "bg-purple-500/10 text-purple-500",
        };

        return (
            <Badge className={colors[type] || ""}>{type.replace("_", " ")}</Badge>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">
                            Transaction Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Approve or reject pending transactions
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <Card className="p-4 glass">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="">All Statuses</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                                    <SelectItem value="">All Types</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>

                {/* Transactions Table */}
                <Card className="glass">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Wallet/Hash</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell className="font-medium">
                                            {transaction.user.email}
                                        </TableCell>
                                        <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                                        <TableCell className="font-semibold">
                                            ${transaction.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>{transaction.method || "N/A"}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                            {transaction.walletAddress ||
                                                transaction.transactionHash ||
                                                "N/A"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                        <TableCell>
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {transaction.status === "PENDING" && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() =>
                                                            handleUpdateStatus(transaction.id, "COMPLETED")
                                                        }
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleUpdateStatus(transaction.id, "FAILED")
                                                        }
                                                    >
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {transaction.status !== "PENDING" && (
                                                <span className="text-sm text-muted-foreground">
                                                    No actions
                                                </span>
                                            )}
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

export default TransactionManagement;
