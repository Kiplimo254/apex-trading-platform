import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Settings as SettingsIcon,
    Save,
    DollarSign,
    Percent,
    Clock,
    Mail,
    Shield,
    Bell,
} from "lucide-react";

const Settings = () => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);

    // Platform Settings
    const [platformSettings, setPlatformSettings] = useState({
        platformName: "Apex Trade",
        platformEmail: "admin@apextrade.com",
        supportEmail: "support@apextrade.com",
        maintenanceMode: false,
    });

    // Investment Settings
    const [investmentSettings, setInvestmentSettings] = useState({
        minInvestment: 100,
        maxInvestment: 100000,
        defaultInterestRate: 5,
        compoundingFrequency: "daily",
    });

    // Transaction Settings
    const [transactionSettings, setTransactionSettings] = useState({
        minDeposit: 50,
        minWithdrawal: 20,
        withdrawalFee: 2.5,
        processingTime: 24,
    });

    // Referral Settings
    const [referralSettings, setReferralSettings] = useState({
        referralBonus: 10,
        commissionRate: 5,
        minReferrals: 1,
    });

    const handleSave = async (section: string) => {
        setSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: `${section} settings saved successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save settings",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Settings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure platform settings and parameters
                    </p>
                </div>

                {/* Platform Settings */}
                <Card className="glass">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <SettingsIcon className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Platform Settings
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    General platform configuration
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="platformName">Platform Name</Label>
                                <Input
                                    id="platformName"
                                    value={platformSettings.platformName}
                                    onChange={(e) =>
                                        setPlatformSettings({
                                            ...platformSettings,
                                            platformName: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="platformEmail">Platform Email</Label>
                                <Input
                                    id="platformEmail"
                                    type="email"
                                    value={platformSettings.platformEmail}
                                    onChange={(e) =>
                                        setPlatformSettings({
                                            ...platformSettings,
                                            platformEmail: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input
                                    id="supportEmail"
                                    type="email"
                                    value={platformSettings.supportEmail}
                                    onChange={(e) =>
                                        setPlatformSettings({
                                            ...platformSettings,
                                            supportEmail: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleSave("Platform")}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Investment Settings */}
                <Card className="glass">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Investment Settings
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Configure investment parameters
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minInvestment">Minimum Investment ($)</Label>
                                <Input
                                    id="minInvestment"
                                    type="number"
                                    value={investmentSettings.minInvestment}
                                    onChange={(e) =>
                                        setInvestmentSettings({
                                            ...investmentSettings,
                                            minInvestment: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="maxInvestment">Maximum Investment ($)</Label>
                                <Input
                                    id="maxInvestment"
                                    type="number"
                                    value={investmentSettings.maxInvestment}
                                    onChange={(e) =>
                                        setInvestmentSettings({
                                            ...investmentSettings,
                                            maxInvestment: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="defaultInterestRate">Default Interest Rate (%)</Label>
                                <Input
                                    id="defaultInterestRate"
                                    type="number"
                                    step="0.1"
                                    value={investmentSettings.defaultInterestRate}
                                    onChange={(e) =>
                                        setInvestmentSettings({
                                            ...investmentSettings,
                                            defaultInterestRate: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
                                <select
                                    id="compoundingFrequency"
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                                    value={investmentSettings.compoundingFrequency}
                                    onChange={(e) =>
                                        setInvestmentSettings({
                                            ...investmentSettings,
                                            compoundingFrequency: e.target.value,
                                        })
                                    }
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleSave("Investment")}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Transaction Settings */}
                <Card className="glass">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Transaction Settings
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Configure transaction limits and fees
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="minDeposit">Minimum Deposit ($)</Label>
                                <Input
                                    id="minDeposit"
                                    type="number"
                                    value={transactionSettings.minDeposit}
                                    onChange={(e) =>
                                        setTransactionSettings({
                                            ...transactionSettings,
                                            minDeposit: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="minWithdrawal">Minimum Withdrawal ($)</Label>
                                <Input
                                    id="minWithdrawal"
                                    type="number"
                                    value={transactionSettings.minWithdrawal}
                                    onChange={(e) =>
                                        setTransactionSettings({
                                            ...transactionSettings,
                                            minWithdrawal: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                                <Input
                                    id="withdrawalFee"
                                    type="number"
                                    step="0.1"
                                    value={transactionSettings.withdrawalFee}
                                    onChange={(e) =>
                                        setTransactionSettings({
                                            ...transactionSettings,
                                            withdrawalFee: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="processingTime">Processing Time (hours)</Label>
                                <Input
                                    id="processingTime"
                                    type="number"
                                    value={transactionSettings.processingTime}
                                    onChange={(e) =>
                                        setTransactionSettings({
                                            ...transactionSettings,
                                            processingTime: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleSave("Transaction")}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Referral Settings */}
                <Card className="glass">
                    <div className="p-6 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <Percent className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Referral Settings
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Configure referral program parameters
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="referralBonus">Referral Bonus ($)</Label>
                                <Input
                                    id="referralBonus"
                                    type="number"
                                    value={referralSettings.referralBonus}
                                    onChange={(e) =>
                                        setReferralSettings({
                                            ...referralSettings,
                                            referralBonus: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                                <Input
                                    id="commissionRate"
                                    type="number"
                                    step="0.1"
                                    value={referralSettings.commissionRate}
                                    onChange={(e) =>
                                        setReferralSettings({
                                            ...referralSettings,
                                            commissionRate: parseFloat(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="minReferrals">Minimum Referrals</Label>
                                <Input
                                    id="minReferrals"
                                    type="number"
                                    value={referralSettings.minReferrals}
                                    onChange={(e) =>
                                        setReferralSettings({
                                            ...referralSettings,
                                            minReferrals: parseInt(e.target.value),
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handleSave("Referral")}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Info Card */}
                <Card className="p-6 glass bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                                Settings Note
                            </h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                These settings are currently stored locally. Connect to the backend API
                                endpoint <code className="px-1 py-0.5 bg-amber-100 dark:bg-amber-900 rounded">/api/admin/settings</code> to persist changes to the database.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default Settings;
