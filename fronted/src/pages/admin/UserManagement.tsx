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
import { Search, Edit, Ban, Shield, CheckCircle, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [editBalance, setEditBalance] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
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

    const handleChangeRole = (user: User) => {
        setSelectedUser(user);
        setSelectedRole(user.role);
        setRoleDialogOpen(true);
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

    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/admin/users/${selectedUser.id}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ role: selectedRole }),
                }
            );

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                setRoleDialogOpen(false);
                fetchUsers();
            } else {
                toast({
                    title: "Error",
                    description: data.error || "Failed to update user role",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user role",
                variant: "destructive",
            });
        }
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus = !user.isActive;
        const action = newStatus ? "activate" : "deactivate";

        if (!confirm(`Are you sure you want to ${action} this user?`)) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/admin/users/${user.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isActive: newStatus }),
                }
            );

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                fetchUsers();
            } else {
                toast({
                    title: "Error",
                    description: data.error || `Failed to ${action} user`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${action} user`,
                variant: "destructive",
            });
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN":
                return "destructive";
            case "ADMIN":
                return "default";
            default:
                return "secondary";
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
                            Manage all platform users and permissions
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
                                            <Badge variant={getRoleBadgeVariant(user.role)}>
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
                                                    title="Edit Balance"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleChangeRole(user)}
                                                    title="Change Role"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleToggleStatus(user)}
                                                    title={user.isActive ? "Deactivate" : "Activate"}
                                                >
                                                    {user.isActive ? (
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    )}
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

                {/* Change Role Dialog */}
                <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change User Role</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>User Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedUser?.email}
                                </p>
                            </div>
                            <div>
                                <Label>Current Role</Label>
                                <p className="text-sm font-medium">
                                    <Badge variant={getRoleBadgeVariant(selectedUser?.role || "")}>
                                        {selectedUser?.role}
                                    </Badge>
                                </p>
                            </div>
                            <div>
                                <Label htmlFor="role">New Role</Label>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="USER">USER</SelectItem>
                                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                                        <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-2">
                                    ⚠️ Only SUPER_ADMIN can promote users to SUPER_ADMIN
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpdateRole}>Update Role</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;
