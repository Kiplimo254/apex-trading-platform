import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Ban, Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    balance: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalProfit: number;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editBalance, setEditBalance] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const url = search
                ? `http://localhost:5000/api/admin/users?search=${search}`
                : "http://localhost:5000/api/admin/users";

            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditBalance(user.balance.toString());
        setEditDialogOpen(true);
    };

    const handleUpdateBalance = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/admin/users/${selectedUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ balance: parseFloat(editBalance) }),
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User balance updated successfully",
                });
                setEditDialogOpen(false);
                fetchUsers();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user balance",
                variant: "destructive",
            });
        }
    };

    const handleDeactivateUser = async (userId: string) => {
        if (!confirm("Are you sure you want to deactivate this user?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/admin/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "User deactivated successfully",
                });
                fetchUsers();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to deactivate user",
                variant: "destructive",
            });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">
                            User Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage all platform users
                        </p>
                    </div>
                </div>

                {/* Search */}
                <Card className="p-4 glass">
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by email, name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                </Card>

                {/* Users Table */}
                <Card className="glass">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>Deposits</TableHead>
                                <TableHead>Withdrawals</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
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
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.email}</TableCell>
                                        <TableCell>
                                            {user.firstName && user.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>${user.balance.toLocaleString()}</TableCell>
                                        <TableCell>${user.totalDeposits.toLocaleString()}</TableCell>
                                        <TableCell>${user.totalWithdrawals.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                                {user.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDeactivateUser(user.id)}
                                                    disabled={!user.isActive}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Edit Balance Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User Balance</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>User Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedUser?.email}
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="balance">New Balance</Label>
                                <Input
                                    id="balance"
                                    type="number"
                                    value={editBalance}
                                    onChange={(e) => setEditBalance(e.target.value)}
                                    placeholder="Enter new balance"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateBalance}>Update Balance</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
