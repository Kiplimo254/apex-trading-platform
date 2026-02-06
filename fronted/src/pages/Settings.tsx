import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

const Settings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data - will be replaced with real data
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    country: "United States",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailDeposit: true,
    emailWithdrawal: true,
    emailProfit: true,
    emailReferral: true,
    emailNews: false,
    pushAll: true,
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to backend later
    console.log("Profile update:", profileData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be connected to backend later
    console.log("Password update:", passwordData);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-display font-bold text-foreground mb-6">
              Profile Information
            </h2>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {profileData.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <Button variant="hero-outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({ ...profileData, fullName: e.target.value })
                    }
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) =>
                      setProfileData({ ...profileData, country: e.target.value })
                    }
                    className="h-12 bg-secondary border-border"
                  />
                </div>
              </div>

              <Button type="submit" variant="hero">
                Save Changes
              </Button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-display font-bold text-foreground mb-6">
                Change Password
              </h2>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="h-12 bg-secondary border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="h-12 bg-secondary border-border pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="h-12 bg-secondary border-border"
                  />
                </div>

                <Button type="submit" variant="hero">
                  Update Password
                </Button>
              </form>
            </div>

            {/* Two-Factor Authentication */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Button
                  variant={twoFactorEnabled ? "destructive" : "hero"}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? "Disable" : "Enable"}
                </Button>
              </div>
              {twoFactorEnabled && (
                <div className="mt-4 p-4 bg-success/10 border border-success/30 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-sm text-foreground">
                    Two-factor authentication is enabled
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-display font-bold text-foreground mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">
                  Email Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    { key: "emailDeposit", label: "Deposit confirmations" },
                    { key: "emailWithdrawal", label: "Withdrawal updates" },
                    { key: "emailProfit", label: "Daily profit reports" },
                    { key: "emailReferral", label: "Referral earnings" },
                    { key: "emailNews", label: "News and promotions" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg cursor-pointer"
                    >
                      <span className="text-foreground">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={notifications[item.key as keyof typeof notifications] as boolean}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-border bg-secondary accent-primary"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-4">
                  Push Notifications
                </h3>
                <label className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg cursor-pointer">
                  <div>
                    <span className="text-foreground block">
                      Enable push notifications
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Receive real-time updates in your browser
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushAll}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        pushAll: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-border bg-secondary accent-primary"
                  />
                </label>
              </div>

              <Button variant="hero">Save Preferences</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
