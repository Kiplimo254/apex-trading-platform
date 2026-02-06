import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    ArrowLeftRight,
    TrendingUp,
    UserPlus,
    Settings,
    BarChart3,
    LogOut,
} from "lucide-react";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const menuItems = [
        { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/admin/users", icon: Users, label: "Users" },
        { path: "/admin/transactions", icon: ArrowLeftRight, label: "Transactions" },
        { path: "/admin/investments", icon: TrendingUp, label: "Investments" },
        { path: "/admin/referrals", icon: UserPlus, label: "Referrals" },
        { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        { path: "/admin/settings", icon: Settings, label: "Settings" },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center border-b border-border px-6">
                        <h1 className="text-xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent">
                            Apex Admin
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className="w-full justify-start"
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="border-t border-border p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-destructive hover:text-destructive"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-card/95 backdrop-blur px-6">
                    <div className="flex flex-1 items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Admin Panel
                        </h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                Logged in as Admin
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
