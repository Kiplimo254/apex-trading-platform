import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowDownToLine,
  Smartphone,
  CreditCard,
  Copy,
  CheckCircle,
  Info,
  X,
  Wallet,
} from "lucide-react";
import { transactionAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  instructions: string | null;
  paypalEmail: string | null;
  walletAddress: string | null;
  isActive: boolean;
}

const Deposit = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/payment-methods?activeOnly=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.data);
        if (data.data.length > 0) {
          setSelectedMethod(data.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const handleCopyEmail = () => {
    if (selectedMethod?.paypalEmail) {
      navigator.clipboard.writeText(selectedMethod.paypalEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyWallet = () => {
    if (selectedMethod?.walletAddress) {
      navigator.clipboard.writeText(selectedMethod.walletAddress);
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await transactionAPI.createDeposit({
        amount: parseFloat(amount),
        method: selectedMethod?.name || "",
        walletAddress: null,
      });

      toast({
        title: "Deposit request submitted!",
        description: "Your deposit will be credited after admin approval",
      });

      setAmount("");
      setShowInstructions(false);
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

  const getMethodIcon = (type: string) => {
    if (type === "MOBILE_MONEY") return Smartphone;
    if (type === "ONLINE_PAYMENT") return CreditCard;
    if (type === "CRYPTO") return Wallet;
    return Smartphone;
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
            Add funds to your account using local or crypto payment methods
          </p>
        </div>

        {/* Deposit Form */}
        <div className="glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label>Select Payment Method</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = getMethodIcon(method.type);
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method)}
                      className={`p-4 rounded-lg border-2 transition-all ${selectedMethod?.id === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod?.id === method.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                            }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-sm">{method.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Deposit Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="10"
                placeholder="Enter amount"
                className="h-12 text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                Minimum deposit: $10
              </p>
            </div>

            {/* View Instructions Button */}
            {selectedMethod && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowInstructions(true)}
              >
                <Info className="w-4 h-4 mr-2" />
                View {selectedMethod.name} Instructions
              </Button>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={loading || !amount || !selectedMethod}
            >
              {loading ? "Processing..." : "Submit Deposit Request"}
            </Button>
          </form>
        </div>

        {/* Important Notice */}
        <div className="glass rounded-xl p-6 border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Important Information
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Deposits are processed within 5-30 minutes after payment confirmation</li>
                <li>• Make sure to follow the payment instructions carefully</li>
                <li>• Keep your transaction reference/screenshot for verification</li>
                <li>• Contact support if your deposit is not credited within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions Modal */}
      {showInstructions && selectedMethod && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {selectedMethod.name} Payment Instructions
              </h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* PayPal Email */}
              {selectedMethod.name === "PayPal" && selectedMethod.paypalEmail && (
                <div className="bg-secondary rounded-lg p-4">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    PayPal Email Address
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-4 py-3 rounded-md text-foreground font-mono text-sm">
                      {selectedMethod.paypalEmail}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyEmail}
                    >
                      {copiedEmail ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Crypto Wallet Address */}
              {selectedMethod.type === "CRYPTO" && selectedMethod.walletAddress && (
                <div className="bg-secondary rounded-lg p-4">
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Wallet Address (TRC20)
                  </Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-background px-4 py-3 rounded-md text-foreground font-mono text-sm break-all">
                      {selectedMethod.walletAddress}
                    </code>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyWallet}
                    >
                      {copiedWallet ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Important: Only send USDT on TRC20 network. Wrong network = Lost funds!
                  </p>
                </div>
              )}

              {/* Instructions */}
              {selectedMethod.instructions && (
                <div className="prose prose-sm max-w-none">
                  <div
                    className="text-foreground whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: selectedMethod.instructions
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>")
                        .replace(/{paypalEmail}/g, selectedMethod.paypalEmail || ""),
                    }}
                  />
                </div>
              )}

              {/* Close Button */}
              <Button
                type="button"
                className="w-full"
                onClick={() => setShowInstructions(false)}
              >
                Got it, Close Instructions
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Deposit;
