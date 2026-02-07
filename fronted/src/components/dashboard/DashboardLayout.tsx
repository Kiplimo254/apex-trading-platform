import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  BarChart3,
  Bot,
  Briefcase,
  BookOpen,
  GraduationCap,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BarChart3, label: "Markets", href: "/dashboard/markets" },
  { icon: Bot, label: "Trading Bots", href: "/dashboard/bots" },
  { icon: Briefcase, label: "Portfolio", href: "/dashboard/portfolio" },
  { icon: BookOpen, label: "Trade Journal", href: "/dashboard/trades" },
  { icon: GraduationCap, label: "Live Classes", href: "/mentorship" },
  { icon: GraduationCap, label: "My Classes", href: "/my-classes" },
  { icon: Wallet, label: "Investments", href: "/dashboard/investments" },
  { icon: ArrowDownToLine, label: "Deposit", href: "/dashboard/deposit" },
  { icon: ArrowUpFromLine, label: "Withdraw", href: "/dashboard/withdraw" },
  { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data - will be replaced with real data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: null,
  };

  const handleLogout = () => {
    // Will be connected to backend later
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden lg:block z-40">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Apex<span className="text-gradient-gold">Trade</span>
            </span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card border-r border-border animate-slide-in-right">
            <div className="p-6 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">
                  Apex<span className="text-gradient-gold">Trade</span>
                </span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <nav className="px-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-foreground">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-card py-2 z-50">
                  <Link
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
