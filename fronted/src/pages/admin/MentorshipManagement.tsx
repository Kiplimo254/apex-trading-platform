import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface MentorshipClass {
    id: string;
    title: string;
    description: string;
    category: string;
    instructor: string;
    scheduledDate: string;
    duration: number;
    platform: string;
    meetingLink: string | null;
    meetingPassword: string | null;
    fee: number;
    maxParticipants: number | null;
    status: string;
    _count: {
        registrations: number;
    };
}

const MentorshipManagement = () => {
    const [classes, setClasses] = useState<MentorshipClass[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<MentorshipClass | null>(null);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Beginner",
        instructor: "",
        scheduledDate: "",
        duration: "60",
        platform: "Zoom",
        meetingLink: "",
        meetingPassword: "",
        fee: "0",
        maxParticipants: "",
    });

    useEffect(() => {
        fetchClasses();
        fetchStats();
    }, []);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/mentorship/admin/classes", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setClasses(data.data);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/mentorship/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const url = editingClass
                ? `http://localhost:5000/api/mentorship/admin/classes/${editingClass.id}`
                : "http://localhost:5000/api/mentorship/admin/classes";

            const response = await fetch(url, {
                method: editingClass ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: editingClass ? "Class updated successfully" : "Class created successfully",
                });
                setIsDialogOpen(false);
                resetForm();
                fetchClasses();
                fetchStats();
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
        }
    };

    const handleEdit = (classItem: MentorshipClass) => {
        setEditingClass(classItem);
        setFormData({
            title: classItem.title,
            description: classItem.description,
            category: classItem.category,
            instructor: classItem.instructor,
            scheduledDate: new Date(classItem.scheduledDate).toISOString().slice(0, 16),
            duration: classItem.duration.toString(),
            platform: classItem.platform,
            meetingLink: classItem.meetingLink || "",
            meetingPassword: classItem.meetingPassword || "",
            fee: classItem.fee.toString(),
            maxParticipants: classItem.maxParticipants?.toString() || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/mentorship/admin/classes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Class deleted successfully",
                });
                fetchClasses();
                fetchStats();
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setEditingClass(null);
        setFormData({
            title: "",
            description: "",
            category: "Beginner",
            instructor: "",
            scheduledDate: "",
            duration: "60",
            platform: "Zoom",
            meetingLink: "",
            meetingPassword: "",
            fee: "0",
            maxParticipants: "",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SCHEDULED":
                return <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20">Scheduled</Badge>;
            case "COMPLETED":
                return <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">Completed</Badge>;
            case "CANCELLED":
                return <Badge className="bg-red-500/10 text-red-500 border border-red-500/20">Cancelled</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground">
                            Mentorship Management
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Manage live classes and registrations
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Class
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingClass ? "Edit Class" : "Create New Class"}
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md"
                                            required
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="instructor">Instructor</Label>
                                        <Input
                                            id="instructor"
                                            value={formData.instructor}
                                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="scheduledDate">Date & Time</Label>
                                        <Input
                                            id="scheduledDate"
                                            type="datetime-local"
                                            value={formData.scheduledDate}
                                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="duration">Duration (minutes)</Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="platform">Platform</Label>
                                        <select
                                            id="platform"
                                            value={formData.platform}
                                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                            className="w-full px-3 py-2 bg-secondary border border-border rounded-md"
                                            required
                                        >
                                            <option value="Zoom">Zoom</option>
                                            <option value="Google Meet">Google Meet</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="fee">Fee ($)</Label>
                                        <Input
                                            id="fee"
                                            type="number"
                                            step="0.01"
                                            value={formData.fee}
                                            onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="meetingLink">Meeting Link</Label>
                                        <Input
                                            id="meetingLink"
                                            type="url"
                                            value={formData.meetingLink}
                                            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                            placeholder="https://zoom.us/j/..."
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="meetingPassword">Meeting Password (optional)</Label>
                                        <Input
                                            id="meetingPassword"
                                            value={formData.meetingPassword}
                                            onChange={(e) => setFormData({ ...formData, meetingPassword: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="maxParticipants">Max Participants (optional)</Label>
                                        <Input
                                            id="maxParticipants"
                                            type="number"
                                            value={formData.maxParticipants}
                                            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingClass ? "Update Class" : "Create Class"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                {stats && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card className="p-6 glass">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-blue-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Upcoming</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 glass">
                            <div className="flex items-center gap-3">
                                <Users className="w-8 h-8 text-green-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Registrations</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.totalRegistrations}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 glass">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-8 h-8 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Revenue</p>
                                    <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 glass">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-gray-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Classes List */}
                <div className="space-y-4">
                    {loading ? (
                        <Card className="p-8 text-center glass">
                            <p className="text-muted-foreground">Loading classes...</p>
                        </Card>
                    ) : classes.length === 0 ? (
                        <Card className="p-8 text-center glass">
                            <p className="text-muted-foreground">No classes created yet</p>
                        </Card>
                    ) : (
                        classes.map((classItem) => (
                            <Card key={classItem.id} className="p-6 glass">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {classItem.title}
                                            </h3>
                                            {getStatusBadge(classItem.status)}
                                            {classItem.fee === 0 && (
                                                <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                                                    FREE
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {classItem.instructor} • {classItem.category}
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                                            <div>
                                                📅 {format(new Date(classItem.scheduledDate), "MMM dd, yyyy • h:mm a")}
                                            </div>
                                            <div>
                                                ⏱️ {classItem.duration} mins • {classItem.platform}
                                            </div>
                                            <div>
                                                👥 {classItem._count.registrations} registered
                                                {classItem.fee > 0 && ` • $${classItem.fee}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(classItem)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(classItem.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default MentorshipManagement;
