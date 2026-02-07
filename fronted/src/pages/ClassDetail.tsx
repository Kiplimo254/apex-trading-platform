import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, DollarSign, Video, Copy, Check, ExternalLink } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MentorshipClass {
    id: string;
    title: string;
    description: string;
    category: string;
    instructor: string;
    scheduledDate: string;
    duration: number;
    platform: string;
    fee: number;
    maxParticipants: number | null;
    _count: {
        registrations: number;
    };
}

interface Registration {
    id: string;
    paymentStatus: string;
    amountPaid: number;
}

const ClassDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [classData, setClassData] = useState<MentorshipClass | null>(null);
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [meetingInfo, setMeetingInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchClassDetails();
        checkRegistration();
    }, [id]);

    const fetchClassDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/mentorship/classes/${id}`);
            const data = await response.json();

            if (data.success) {
                setClassData(data.data);
            }
        } catch (error) {
            console.error("Error fetching class:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch("http://localhost:5000/api/mentorship/my-classes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                const reg = data.data.find((r: any) => r.classId === id);
                if (reg) {
                    setRegistration(reg);
                    if (reg.paymentStatus === "PAID") {
                        fetchMeetingLink();
                    }
                }
            }
        } catch (error) {
            console.error("Error checking registration:", error);
        }
    };

    const fetchMeetingLink = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/mentorship/meeting-link/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setMeetingInfo(data.data);
            }
        } catch (error) {
            console.error("Error fetching meeting link:", error);
        }
    };

    const handleRegister = async () => {
        try {
            setRegistering(true);
            const token = localStorage.getItem("token");

            if (!token) {
                toast({
                    title: "Authentication Required",
                    description: "Please login to register for classes",
                    variant: "destructive",
                });
                navigate("/login");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/mentorship/register/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success!",
                    description: data.message,
                });
                checkRegistration();
            } else {
                toast({
                    title: "Error",
                    description: data.message,
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setRegistering(false);
        }
    };

    const handleCopyLink = () => {
        if (meetingInfo?.meetingLink) {
            navigator.clipboard.writeText(meetingInfo.meetingLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Copied!",
                description: "Meeting link copied to clipboard",
            });
        }
    };

    const handleJoinMeeting = () => {
        if (meetingInfo?.meetingLink) {
            window.open(meetingInfo.meetingLink, "_blank");
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Card className="p-8 text-center glass">
                    <p className="text-muted-foreground">Loading class details...</p>
                </Card>
            </DashboardLayout>
        );
    }

    if (!classData) {
        return (
            <DashboardLayout>
                <Card className="p-8 text-center glass">
                    <p className="text-muted-foreground">Class not found</p>
                    <Button className="mt-4" onClick={() => navigate("/mentorship")}>
                        Back to Classes
                    </Button>
                </Card>
            </DashboardLayout>
        );
    }

    const isFullyBooked =
        classData.maxParticipants &&
        classData._count.registrations >= classData.maxParticipants;

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in max-w-4xl">
                {/* Back Button */}
                <Button variant="outline" onClick={() => navigate("/mentorship")}>
                    ← Back to Classes
                </Button>

                {/* Class Header */}
                <Card className="p-8 glass">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-2">
                            <Badge className="bg-primary/10 text-primary border border-primary/20">
                                {classData.category}
                            </Badge>
                            {classData.fee === 0 ? (
                                <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                                    FREE
                                </Badge>
                            ) : (
                                <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                    ${classData.fee}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                        {classData.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                        Instructor: {classData.instructor}
                    </p>

                    <p className="text-foreground mb-6">{classData.description}</p>

                    {/* Class Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Calendar className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm">Date & Time</p>
                                <p className="font-semibold text-foreground">
                                    {format(new Date(classData.scheduledDate), "MMMM dd, yyyy")}
                                </p>
                                <p className="text-sm">
                                    {format(new Date(classData.scheduledDate), "h:mm a")} EAT
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm">Duration</p>
                                <p className="font-semibold text-foreground">
                                    {classData.duration} minutes
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Video className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm">Platform</p>
                                <p className="font-semibold text-foreground">{classData.platform}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm">Participants</p>
                                <p className="font-semibold text-foreground">
                                    {classData._count.registrations}
                                    {classData.maxParticipants && `/${classData.maxParticipants}`} registered
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Registration Status */}
                    {registration ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-500 font-semibold">✓ You're registered for this class!</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Payment Status: {registration.paymentStatus}
                                </p>
                            </div>

                            {/* Meeting Link (if paid) */}
                            {registration.paymentStatus === "PAID" && meetingInfo && (
                                <Card className="p-6 bg-primary/5 border-primary/20">
                                    <h3 className="font-semibold text-foreground mb-4">
                                        🎥 Meeting Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Meeting Link:</p>
                                            <div className="flex gap-2">
                                                <code className="flex-1 text-sm bg-secondary px-3 py-2 rounded break-all">
                                                    {meetingInfo.meetingLink}
                                                </code>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCopyLink}
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>

                                        {meetingInfo.meetingPassword && (
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Password:</p>
                                                <code className="text-sm bg-secondary px-3 py-1 rounded">
                                                    {meetingInfo.meetingPassword}
                                                </code>
                                            </div>
                                        )}

                                        <Button className="w-full" onClick={handleJoinMeeting}>
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Join Meeting
                                        </Button>
                                    </div>
                                </Card>
                            )}

                            {registration.paymentStatus === "PENDING" && classData.fee > 0 && (
                                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                    <p className="text-orange-500 font-semibold">⏳ Payment Pending</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Please complete payment of ${classData.fee} to access the meeting link.
                                        Contact admin for payment approval.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {isFullyBooked ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <p className="text-red-500 font-semibold">Class is fully booked</p>
                                </div>
                            ) : (
                                <>
                                    {classData.fee > 0 && (
                                        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-5 h-5 text-blue-500" />
                                                <p className="text-blue-500 font-semibold">
                                                    Class Fee: ${classData.fee}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Payment required after registration. Meeting link will be provided after payment approval.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={handleRegister}
                                        disabled={registering}
                                    >
                                        {registering ? "Registering..." : classData.fee === 0 ? "Register for Free" : "Register Now"}
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ClassDetail;
