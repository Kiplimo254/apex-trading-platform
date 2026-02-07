import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, DollarSign, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    fee: number;
    maxParticipants: number | null;
    _count: {
        registrations: number;
    };
}

const Mentorship = () => {
    const [classes, setClasses] = useState<MentorshipClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const navigate = useNavigate();

    const categories = ["All", "Beginner", "Intermediate", "Advanced"];

    useEffect(() => {
        fetchClasses();
    }, [selectedCategory]);

    const fetchClasses = async () => {
        try {
            const url =
                selectedCategory === "All"
                    ? "http://localhost:5000/api/mentorship/classes"
                    : `http://localhost:5000/api/mentorship/classes?category=${selectedCategory}`;

            const response = await fetch(url);
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

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Beginner":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "Intermediate":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Advanced":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getPlatformIcon = (platform: string) => {
        return platform === "Zoom" ? "💻" : "📹";
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        🎓 Live Mentorship Classes
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Join live trading sessions with expert instructors
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            onClick={() => setSelectedCategory(category)}
                            className="transition-all"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Classes Grid */}
                {loading ? (
                    <Card className="p-8 text-center glass">
                        <p className="text-muted-foreground">Loading classes...</p>
                    </Card>
                ) : classes.length === 0 ? (
                    <Card className="p-8 text-center glass">
                        <p className="text-muted-foreground">
                            No upcoming classes in this category
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {classes.map((classItem) => (
                            <Card
                                key={classItem.id}
                                className="p-6 glass hover:shadow-lg transition-all cursor-pointer group"
                                onClick={() => navigate(`/mentorship/${classItem.id}`)}
                            >
                                {/* Category Badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <Badge
                                        className={`${getCategoryColor(
                                            classItem.category
                                        )} border`}
                                    >
                                        {classItem.category}
                                    </Badge>
                                    {classItem.fee === 0 ? (
                                        <Badge className="bg-green-500/10 text-green-500 border border-green-500/20">
                                            FREE
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-orange-500/10 text-orange-500 border border-orange-500/20">
                                            ${classItem.fee}
                                        </Badge>
                                    )}
                                </div>

                                {/* Title & Instructor */}
                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {classItem.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    By: {classItem.instructor}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {classItem.description}
                                </p>

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(classItem.scheduledDate), "MMM dd, yyyy • h:mm a")}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {classItem.duration} mins
                                        <span className="mx-2">•</span>
                                        <Video className="w-4 h-4" />
                                        {getPlatformIcon(classItem.platform)} {classItem.platform}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        {classItem._count.registrations}
                                        {classItem.maxParticipants && `/${classItem.maxParticipants}`} registered
                                    </div>
                                </div>

                                {/* Register Button */}
                                <Button className="w-full" onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/mentorship/${classItem.id}`);
                                }}>
                                    {classItem.fee === 0 ? "Register Free" : "View Details"}
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Mentorship;
