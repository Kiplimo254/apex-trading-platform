import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Investments from "./pages/Investments";
import Referrals from "./pages/Referrals";
import Settings from "./pages/Settings";
import Markets from "./pages/Markets";
import CoinDetail from "./pages/CoinDetail";
import Bots from "./pages/Bots";
import MyBots from "./pages/MyBots";
import Portfolio from "./pages/Portfolio";
import TradeJournal from "./pages/TradeJournal";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TransactionManagement from "./pages/admin/TransactionManagement";
import InvestmentManagement from "./pages/admin/InvestmentManagement";
import ReferralManagement from "./pages/admin/ReferralManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import PaymentMethodsManagement from "./pages/admin/PaymentMethodsManagement";
import Mentorship from "./pages/Mentorship";
import ClassDetail from "./pages/ClassDetail";
import MyClasses from "./pages/MyClasses";
import MentorshipManagement from "./pages/admin/MentorshipManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/deposit" element={<Deposit />} />
          <Route path="/dashboard/withdraw" element={<Withdraw />} />
          <Route path="/dashboard/investments" element={<Investments />} />
          <Route path="/dashboard/referrals" element={<Referrals />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/markets" element={<Markets />} />
          <Route path="/dashboard/markets/:coinId" element={<CoinDetail />} />
          <Route path="/dashboard/bots" element={<Bots />} />
          <Route path="/dashboard/my-bots" element={<MyBots />} />
          <Route path="/dashboard/portfolio" element={<Portfolio />} />
          <Route path="/dashboard/trades" element={<TradeJournal />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/mentorship/:id" element={<ClassDetail />} />
          <Route path="/my-classes" element={<MyClasses />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/transactions" element={<TransactionManagement />} />
          <Route path="/admin/investments" element={<InvestmentManagement />} />
          <Route path="/admin/referrals" element={<ReferralManagement />} />
          <Route path="/admin/payment-methods" element={<PaymentMethodsManagement />} />
          <Route path="/admin/mentorship" element={<MentorshipManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
