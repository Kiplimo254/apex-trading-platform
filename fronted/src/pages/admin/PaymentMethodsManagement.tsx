import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, Edit, Save, X, Eye, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
    id: string;
    name: string;
    type: string;
    instructions: string | null;
    paypalEmail: string | null;
    walletAddress: string | null;
    isActive: boolean;
    displayOrder: number;
}

const PaymentMethodsManagement = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [editInstructions, setEditInstructions] = useState("");
    const [editPayPalEmail, setEditPayPalEmail] = useState("");
    const [editWalletAddress, setEditWalletAddress] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/payment-methods", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(data.data);
            }
        } catch (error) {
            console.error("Error fetching payment methods:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (method: PaymentMethod) => {
        setEditingMethod(method);
        setEditInstructions(method.instructions || "");
        setEditPayPalEmail(method.paypalEmail || "");
        setEditWalletAddress(method.walletAddress || "");
    };

    const handleSave = async () => {
        if (!editingMethod) return;

        try {
            const token = localStorage.getItem("token");
            const updateData: any = {};

            if (editingMethod.name === "PayPal") {
                updateData.paypalEmail = editPayPalEmail;
            } else if (editingMethod.type === "CRYPTO") {
                updateData.walletAddress = editWalletAddress;
                updateData.instructions = editInstructions;
            } else {
                updateData.instructions = editInstructions;
            }

            const response = await fetch(
                `http://localhost:5000/api/payment-methods/${editingMethod.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `${editingMethod.name} updated successfully`,
                });
                fetchPaymentMethods();
                setEditingMethod(null);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update payment method",
                variant: "destructive",
            });
        }
    };

    const handleToggleStatus = async (method: PaymentMethod) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:5000/api/payment-methods/${method.id}/toggle`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: `${method.name} ${method.isActive ? "disabled" : "enabled"}`,
                });
                fetchPaymentMethods();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to toggle payment method status",
                variant: "destructive",
            });
        }
    };

    const getMethodIcon = (type: string) => {
        if (type === "MOBILE_MONEY") return Smartphone;
        if (type === "ONLINE_PAYMENT") return CreditCard;
        if (type === "CRYPTO") return Wallet;
        return Smartphone;
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Payment Methods Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Configure payment methods and instructions for users
                    </p>
                </div>

                {/* Payment Methods List */}
                <div className="grid gap-6">
                    {loading ? (
                        <Card className="p-8 text-center glass">
                            <p className="text-muted-foreground">Loading...</p>
                        </Card>
                    ) : (
                        paymentMethods.map((method) => {
                            const Icon = getMethodIcon(method.type);
                            const isEditing = editingMethod?.id === method.id;

                            return (
                                <Card key={method.id} className="p-6 glass">
                                    {/* Method Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {method.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {method.type.replace("_", " ")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={method.isActive ? "default" : "secondary"}
                                            >
                                                {method.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleToggleStatus(method)}
                                            >
                                                {method.isActive ? "Disable" : "Enable"}
                                            </Button>
                                            {!isEditing && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleEdit(method)}
                                                >
                                                    <Edit className="w-4 h-4 mr-1" />
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit Form */}
                                    {isEditing ? (
                                        <div className="space-y-4 border-t border-border pt-4">
                                            {method.name === "PayPal" ? (
                                                <div className="space-y-2">
                                                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                                                    <Input
                                                        id="paypalEmail"
                                                        type="email"
                                                        value={editPayPalEmail}
                                                        onChange={(e) =>
                                                            setEditPayPalEmail(e.target.value)
                                                        }
                                                        placeholder="Enter PayPal email"
                                                        className="bg-secondary"
                                                    />
                                                </div>
                                            ) : method.type === "CRYPTO" ? (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="walletAddress">Wallet Address (TRC20)</Label>
                                                        <Input
                                                            id="walletAddress"
                                                            type="text"
                                                            value={editWalletAddress}
                                                            onChange={(e) =>
                                                                setEditWalletAddress(e.target.value)
                                                            }
                                                            placeholder="Enter USDT TRC20 wallet address"
                                                            className="bg-secondary font-mono"
                                                        />
                                                        <p className="text-xs text-orange-500">
                                                            ⚠️ Make sure this is a valid TRC20 address. Wrong address = Lost funds!
                                                        </p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor="instructions">
                                                                Payment Instructions
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setShowPreview(!showPreview)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                {showPreview ? "Hide" : "Show"} Preview
                                                            </Button>
                                                        </div>
                                                        <Textarea
                                                            id="instructions"
                                                            value={editInstructions}
                                                            onChange={(e) =>
                                                                setEditInstructions(e.target.value)
                                                            }
                                                            placeholder="Enter payment instructions (use {walletAddress} placeholder, supports **bold** formatting)"
                                                            rows={12}
                                                            className="bg-secondary font-mono text-sm"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            Use **text** for bold and {"{walletAddress}"} for wallet placeholder.
                                                        </p>

                                                        {/* Preview */}
                                                        {showPreview && (
                                                            <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
                                                                <h4 className="text-sm font-semibold mb-2">Preview:</h4>
                                                                <div
                                                                    className="text-sm whitespace-pre-wrap"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: editInstructions
                                                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                                            .replace(/\n/g, "<br/>")
                                                                            .replace(/{walletAddress}/g, editWalletAddress || "YOUR_WALLET_ADDRESS"),
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="instructions">
                                                            Payment Instructions
                                                        </Label>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setShowPreview(!showPreview)}
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            {showPreview ? "Hide" : "Show"} Preview
                                                        </Button>
                                                    </div>
                                                    <Textarea
                                                        id="instructions"
                                                        value={editInstructions}
                                                        onChange={(e) =>
                                                            setEditInstructions(e.target.value)
                                                        }
                                                        placeholder="Enter payment instructions (supports **bold** formatting)"
                                                        rows={12}
                                                        className="bg-secondary font-mono text-sm"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        Use **text** for bold formatting. Instructions will be shown to users when they select this payment method.
                                                    </p>

                                                    {/* Preview */}
                                                    {showPreview && (
                                                        <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
                                                            <h4 className="text-sm font-semibold mb-2">Preview:</h4>
                                                            <div
                                                                className="text-sm whitespace-pre-wrap"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: editInstructions
                                                                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                                        .replace(/\n/g, "<br/>"),
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setEditingMethod(null)}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSave}>
                                                    <Save className="w-4 h-4 mr-1" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-t border-border pt-4">
                                            {method.name === "PayPal" ? (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        PayPal Email:
                                                    </p>
                                                    <code className="text-sm bg-secondary px-3 py-1 rounded">
                                                        {method.paypalEmail || "Not configured"}
                                                    </code>
                                                </div>
                                            ) : method.type === "CRYPTO" ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">
                                                            Wallet Address:
                                                        </p>
                                                        <code className="text-sm bg-secondary px-3 py-1 rounded break-all">
                                                            {method.walletAddress || "Not configured"}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Current Instructions:
                                                        </p>
                                                        <div className="text-sm bg-secondary p-3 rounded max-h-32 overflow-y-auto">
                                                            {method.instructions ? (
                                                                <div
                                                                    className="whitespace-pre-wrap"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: method.instructions
                                                                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                                            .replace(/\n/g, "<br/>")
                                                                            .replace(/{walletAddress}/g, method.walletAddress || "NOT_CONFIGURED"),
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-muted-foreground">
                                                                    No instructions configured
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Current Instructions:
                                                    </p>
                                                    <div className="text-sm bg-secondary p-3 rounded max-h-32 overflow-y-auto">
                                                        {method.instructions ? (
                                                            <div
                                                                className="whitespace-pre-wrap"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: method.instructions
                                                                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                                                                        .replace(/\n/g, "<br/>"),
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-muted-foreground">
                                                                No instructions configured
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default PaymentMethodsManagement;
