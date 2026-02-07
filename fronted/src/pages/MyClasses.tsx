import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ExternalLink, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isPast, isFuture } from "date-fns";

interface ClassRegistration {
    id: string;
    paymentStatus: string;
    amountPaid: number;
    attended: boolean;
    createdAt: string;
    class: {
        id: string;
        title: string;
        instructor: string;
        scheduledDate: string;
        duration: number;
        platform: string;
        category: string;
    };
}

const MyClasses = () => {
    const [registrations, setRegistrations] = useState<ClassRegistration[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyClasses();
    }, []);

    const fetchMyClasses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/mentorship/my-classes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setRegistrations(data.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const upcomingClasses = registrations.filter((reg) =>
        isFuture(new Date(reg.class.scheduledDate))
    );

    const pastClasses = registrations.filter((reg) =>
        isPast(new Date(reg.class.scheduledDate))
    );

    const totalSpent = registrations.reduce((sum, reg) => sum + reg.amountPaid, 0);
    const attendedCount = registrations.filter((reg) => reg.attended).length;

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">Paid</Badge>;
            case "PENDING":
                return <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20">Pending</Badge>;
            case "REFUNDED":
                return <Badge className="bg-gray-500/10 text-gray-500 border border-gray-500/20">Refunded</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        📚 My Classes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        View your registered classes and attendance history
                    </p>
                </div>

                {/* Statistics */}
                {registrations.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="p-6 glass">
                            <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
                            <p className="text-3xl font-bold text-foreground">{registrations.length}</p>
                        </Card>
                        <Card className="p-6 glass">
                            <p className="text-sm text-muted-foreground mb-1">Classes Attended</p>
                            <p className="text-3xl font-bold text-green-500">{attendedCount}</p>
                        </Card>
                        <Card className="p-6 glass">
                            <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                            <p className="text-3xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
                        </Card>
                    </div>
                )}

                {loading ? (
                    <Card className="p-8 text-center glass">
                        <p className="text-muted-foreground">Loading your classes...</p>
                    </Card>
                ) : registrations.length === 0 ? (
                    <Card className="p-8 text-center glass">
                        <p className="text-muted-foreground mb-4">
                            You haven't registered for any classes yet
                        </p>
                        <Button onClick={() => navigate("/mentorship")}>
                            Browse Classes
                        </Button>
                    </Card>
                ) : (
                    <>
                        {/* Upcoming Classes */}
                        {upcomingClasses.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground mb-4">
                                    Upcoming Classes
                                </h2>
                                <div className="grid gap-4">
                                    {upcomingClasses.map((reg) => (
                                        <Card key={reg.id} className="p-6 glass">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                                        {reg.class.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        By: {reg.class.instructor}
                                                    </p>
                                                </div>
                                                {getPaymentStatusBadge(reg.paymentStatus)}
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-3 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    {format(new Date(reg.class.scheduledDate), "MMM dd, yyyy • h:mm a")}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    {reg.class.duration} mins • {reg.class.platform}
                                                </div>
                                            </div>

                                            {reg.paymentStatus === "PAID" ? (
                                                <Button
                                                    className="w-full"
                                                    onClick={() => navigate(`/mentorship/${reg.class.id}`)}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    View Meeting Link
                                                </Button>
                                            ) : (
                                                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                                    <p className="text-sm text-orange-500">
                                                        ⏳ Payment pending. Contact admin to approve your payment.
                                                    </p>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Classes */}
                        {pastClasses.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold text-foreground mb-4">
                                    Past Classes
                                </h2>
                                <div className="grid gap-4">
                                    {pastClasses.map((reg) => (
                                        <Card key={reg.id} className="p-6 glass opacity-75">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                                        {reg.class.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        By: {reg.class.instructor}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {reg.attended && (
                                                        <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Attended
                                                        </Badge>
                                                    )}
                                                    <Badge className="bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(reg.class.scheduledDate), "MMM dd, yyyy")}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyClasses;
