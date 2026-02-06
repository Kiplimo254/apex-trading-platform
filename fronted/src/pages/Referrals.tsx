import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Copy,
  CheckCircle,
  DollarSign,
  UserPlus,
  TrendingUp,
  Share2,
} from "lucide-react";

// Mock data - will be replaced with real data from backend
const referralStats = {
  totalReferrals: 23,
  activeReferrals: 18,
  totalEarnings: 1250.0,
  pendingEarnings: 125.0,
  referralCode: "JOHN2024",
};

const referralHistory = [
  {
    id: 1,
    name: "Alice Smith",
    email: "alice@example.com",
    status: "active",
    invested: 2500,
    yourEarning: 175,
    joinedDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "active",
    invested: 1000,
    yourEarning: 70,
    joinedDate: "2024-01-08",
  },
  {
    id: 3,
    name: "Carol Williams",
    email: "carol@example.com",
    status: "pending",
    invested: 0,
    yourEarning: 0,
    joinedDate: "2024-01-15",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    status: "active",
    invested: 5000,
    yourEarning: 350,
    joinedDate: "2024-01-05",
  },
  {
    id: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    status: "inactive",
    invested: 500,
    yourEarning: 35,
    joinedDate: "2023-12-20",
  },
];

const earningsHistory = [
  {
    id: 1,
    referralName: "David Brown",
    amount: 175,
    type: "Investment Commission",
    date: "2024-01-12",
  },
  {
    id: 2,
    referralName: "Alice Smith",
    amount: 87.5,
    type: "Investment Commission",
    date: "2024-01-11",
  },
  {
    id: 3,
    referralName: "Bob Johnson",
    amount: 70,
    type: "Investment Commission",
    date: "2024-01-09",
  },
];

const Referrals = () => {
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://apextrade.com/register?ref=${referralStats.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralStats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join ApexTrade",
          text: "Start investing with ApexTrade and earn daily returns!",
          url: referralLink,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Referral Program
          </h1>
          <p className="text-muted-foreground mt-1">
            Invite friends and earn commissions on their investments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {referralStats.totalReferrals}
            </p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-success" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              {referralStats.activeReferrals}
            </p>
            <p className="text-sm text-muted-foreground">Active Referrals</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-gradient-gold">
              ${referralStats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Earned</p>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">
              ${referralStats.pendingEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Pending Earnings</p>
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-6">
            Your Referral Link
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Referral Code
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={referralStats.referralCode}
                  className="h-12 bg-secondary border-border font-mono text-lg font-bold"
                />
                <Button
                  variant="hero-outline"
                  onClick={handleCopyCode}
                  className="h-12 px-4"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Referral Link
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={referralLink}
                  className="h-12 bg-secondary border-border text-sm"
                />
                <Button
                  variant="hero-outline"
                  onClick={handleCopyLink}
                  className="h-12 px-4"
                >
                  {copiedLink ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button variant="hero" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Link
            </Button>
          </div>

          {/* Commission Tiers */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">
              Commission Tiers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-gradient-gold">5%</p>
                <p className="text-sm text-muted-foreground">Starter Plan</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-gradient-gold">7%</p>
                <p className="text-sm text-muted-foreground">Professional Plan</p>
              </div>
              <div className="text-center p-3 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-gradient-gold">10%</p>
                <p className="text-sm text-muted-foreground">Enterprise Plan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Referral List */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-display font-bold text-foreground mb-6">
              Your Referrals
            </h2>

            <div className="space-y-3">
              {referralHistory.map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {referral.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {referral.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Joined {referral.joinedDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      +${referral.yourEarning}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        referral.status === "active"
                          ? "bg-success/20 text-success"
                          : referral.status === "pending"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings History */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-display font-bold text-foreground mb-6">
              Recent Earnings
            </h2>

            <div className="space-y-3">
              {earningsHistory.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {earning.referralName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {earning.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      +${earning.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {earning.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Referrals;
