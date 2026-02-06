import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowDownToLine,
  Bitcoin,
  Wallet,
  Copy,
  CheckCircle,
  Info,
} from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  {
    id: "btc",
    name: "Bitcoin",
    icon: Bitcoin,
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    minDeposit: "$100",
    processingTime: "10-30 mins",
  },
  {
    id: "eth",
    name: "Ethereum",
    icon: Wallet,
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    minDeposit: "$100",
    processingTime: "5-15 mins",
  },
  {
    id: "usdt",
    name: "USDT (TRC20)",
    icon: Wallet,
    address: "TN2Y3K8d1VzNMALqVMkLg1BbWfVnqBR3Nz",
    minDeposit: "$50",
    processingTime: "5-10 mins",
  },
];

const Deposit = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(selectedMethod.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transactionAPI.createDeposit({
        amount: parseFloat(amount),
        method: selectedMethod.name,
        walletAddress: selectedMethod.address,
      });

      toast({
        title: "Deposit request submitted!",
        description: "Your deposit will be credited after confirmation",
      });

      setAmount("");
    } catch (error: any) {
      toast({
        title: "Deposit failed",
        description: error.message || "Failed to create deposit request",
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
            <ArrowDownToLine className="w-8 h-8 text-primary" />
            Deposit Funds
          </h1>
          <p className="text-muted-foreground mt-1">
            Add funds to your account using cryptocurrency
          </p>
        </div>

        {/* Deposit Form */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-display font-bold text-foreground mb-6">
            Select Payment Method
          </h2>

          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
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
                    Min: {method.minDeposit} • {method.processingTime}
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
                min={50}
                required
              />
              <p className="text-sm text-muted-foreground">
                Minimum deposit: {selectedMethod.minDeposit}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Send {selectedMethod.name} to this address:</Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={selectedMethod.address}
                  className="h-12 bg-secondary border-border font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="hero-outline"
                  onClick={handleCopyAddress}
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

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Important Instructions
                </p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Send only {selectedMethod.name} to this address</li>
                  <li>Minimum deposit: {selectedMethod.minDeposit}</li>
                  <li>
                    Processing time: {selectedMethod.processingTime}
                  </li>
                  <li>Your deposit will be credited after confirmation</li>
                </ul>
              </div>
            </div>

            <Button type="submit" variant="hero" className="w-full h-12" disabled={loading}>
              {loading ? "Submitting..." : "I Have Made The Payment"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
