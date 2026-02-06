import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowUpFromLine,
  Bitcoin,
  Wallet,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { transactionAPI, dashboardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const withdrawalMethods = [
  {
    id: "btc",
    name: "Bitcoin",
    icon: Bitcoin,
    minWithdrawal: "$50",
    fee: "1%",
    processingTime: "1-24 hours",
  },
  {
    id: "eth",
    name: "Ethereum",
    icon: Wallet,
    minWithdrawal: "$50",
    fee: "1%",
    processingTime: "1-24 hours",
  },
  {
    id: "usdt",
    name: "USDT (TRC20)",
    icon: Wallet,
    minWithdrawal: "$20",
    fee: "0.5%",
    processingTime: "1-12 hours",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Wallet,
    minWithdrawal: "$100",
    fee: "2%",
    processingTime: "1-3 days",
  },
];

const Withdraw = () => {
  const [selectedMethod, setSelectedMethod] = useState(withdrawalMethods[0]);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setAvailableBalance(response.data.balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transactionAPI.createWithdrawal({
        amount: parseFloat(amount),
        method: selectedMethod.name,
        walletAddress,
      });

      toast({
        title: "Withdrawal request submitted!",
        description: "Your withdrawal will be processed within " + selectedMethod.processingTime,
      });

      setAmount("");
      setWalletAddress("");
      fetchBalance(); // Refresh balance
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message || "Failed to create withdrawal request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <ArrowUpFromLine className="w-8 h-8 text-primary" />
            Withdraw Funds
          </h1>
          <p className="text-muted-foreground mt-1">
            Withdraw your earnings to your preferred payment method
          </p>
        </div>

        {/* Available Balance */}
        <div className="glass rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <p className="text-3xl font-display font-bold text-gradient-gold">
              ${availableBalance.toLocaleString()}
            </p>
          </div>
          <Wallet className="w-12 h-12 text-primary" />
        </div>

        {/* Withdrawal Form */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-6">
            Withdrawal Details
          </h2>

          <div className="space-y-3 mb-6">
            {withdrawalMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${selectedMethod.id === method.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                  }`}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-medium text-foreground">{method.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Min: {method.minWithdrawal} • Fee: {method.fee}
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${selectedMethod.id === method.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                    }`}
                >
                  {selectedMethod.id === method.id && (
                    <CheckCircle className="w-full h-full text-primary-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                className="h-12 bg-secondary border-border"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={availableBalance}
                required
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Min: {selectedMethod.minWithdrawal}
                </span>
                <button
                  type="button"
                  onClick={() => setAmount(availableBalance.toString())}
                  className="text-primary hover:underline"
                >
                  Max: ${availableBalance.toLocaleString()}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">
                {selectedMethod.id === "bank"
                  ? "Bank Account Number"
                  : "Wallet Address"}
              </Label>
              <Input
                id="wallet"
                type="text"
                placeholder={
                  selectedMethod.id === "bank"
                    ? "Enter your bank account number"
                    : `Enter your ${selectedMethod.name} wallet address`
                }
                className="h-12 bg-secondary border-border"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
              />
            </div>

            {/* Fee calculation */}
            {amount && (
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Withdrawal Amount
                  </span>
                  <span className="text-foreground">${amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Fee ({selectedMethod.fee})
                  </span>
                  <span className="text-foreground">
                    -$
                    {(
                      parseFloat(amount) *
                      (parseFloat(selectedMethod.fee) / 100)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="font-medium text-foreground">
                    You'll Receive
                  </span>
                  <span className="font-bold text-gradient-gold">
                    $
                    {(
                      parseFloat(amount) -
                      parseFloat(amount) *
                      (parseFloat(selectedMethod.fee) / 100)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Please verify your address
                </p>
                <p>
                  Double-check the wallet address before submitting. Funds
                  sent to wrong addresses cannot be recovered.
                </p>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
              {loading ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
