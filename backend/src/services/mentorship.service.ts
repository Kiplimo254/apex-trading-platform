import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MentorshipService {
    // ============ USER METHODS ============

    // Get all upcoming classes
    async getUpcomingClasses(category?: string) {
        const where: any = {
            isActive: true,
            status: 'SCHEDULED',
            scheduledDate: {
                gte: new Date(),
            },
        };

        if (category && category !== 'All') {
            where.category = category;
        }

        const classes = await prisma.mentorshipClass.findMany({
            where,
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
            orderBy: { scheduledDate: 'asc' },
        });

        return classes;
    }

    // Get single class by ID
    async getClassById(id: string) {
        const classData = await prisma.mentorshipClass.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
        });

        return classData;
    }

    // Get user's registered classes
    async getUserRegisteredClasses(userId: string) {
        const registrations = await prisma.classRegistration.findMany({
            where: { userId },
            include: {
                class: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return registrations;
    }

    // Register for a class
    async registerForClass(userId: string, classId: string) {
        // Check if class exists and is available
        const classData = await prisma.mentorshipClass.findUnique({
            where: { id: classId },
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
        });

        if (!classData) {
            throw new Error('Class not found');
        }

        if (!classData.isActive || classData.status !== 'SCHEDULED') {
            throw new Error('Class is not available for registration');
        }

        // Check if max participants reached
        if (classData.maxParticipants && classData._count.registrations >= classData.maxParticipants) {
            throw new Error('Class is fully booked');
        }

        // Check if already registered
        const existing = await prisma.classRegistration.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
        });

        if (existing) {
            throw new Error('Already registered for this class');
        }

        // Create registration
        const registration = await prisma.classRegistration.create({
            data: {
                userId,
                classId,
                amountPaid: classData.fee,
                paymentStatus: classData.fee === 0 ? 'PAID' : 'PENDING',
            },
            include: {
                class: true,
            },
        });

        return registration;
    }

    // Get meeting link (only if registered and paid)
    async getMeetingLink(userId: string, classId: string) {
        const registration = await prisma.classRegistration.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
            include: {
                class: true,
            },
        });

        if (!registration) {
            throw new Error('Not registered for this class');
        }

        if (registration.paymentStatus !== 'PAID') {
            throw new Error('Payment pending. Please complete payment to access meeting link');
        }

        return {
            meetingLink: registration.class.meetingLink,
            meetingPassword: registration.class.meetingPassword,
            platform: registration.class.platform,
        };
    }

    // Mark attendance
    async markAttendance(userId: string, classId: string) {
        const registration = await prisma.classRegistration.findUnique({
            where: {
                userId_classId: {
                    userId,
                    classId,
                },
            },
        });

        if (!registration) {
            throw new Error('Not registered for this class');
        }

        const updated = await prisma.classRegistration.update({
            where: { id: registration.id },
            data: {
                attended: true,
                joinedAt: new Date(),
            },
        });

        return updated;
    }

    // ============ ADMIN METHODS ============

    // Get all classes (including past and cancelled)
    async getAllClasses(status?: string) {
        const where: any = {};

        if (status && status !== 'ALL') {
            where.status = status;
        }

        const classes = await prisma.mentorshipClass.findMany({
            where,
            include: {
                _count: {
                    select: { registrations: true },
                },
            },
            orderBy: { scheduledDate: 'desc' },
        });

        return classes;
    }

    // Create new class
    async createClass(data: any) {
        const classData = await prisma.mentorshipClass.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                instructor: data.instructor,
                scheduledDate: new Date(data.scheduledDate),
                duration: parseInt(data.duration),
                timezone: data.timezone || 'EAT',
                meetingLink: data.meetingLink,
                meetingPassword: data.meetingPassword,
                platform: data.platform || 'Zoom',
                fee: parseFloat(data.fee) || 0,
                maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
                thumbnailUrl: data.thumbnailUrl,
            },
        });

        return classData;
    }

    // Update class
    async updateClass(id: string, data: any) {
        const updateData: any = {};

        if (data.title) updateData.title = data.title;
        if (data.description) updateData.description = data.description;
        if (data.category) updateData.category = data.category;
        if (data.instructor) updateData.instructor = data.instructor;
        if (data.scheduledDate) updateData.scheduledDate = new Date(data.scheduledDate);
        if (data.duration) updateData.duration = parseInt(data.duration);
        if (data.timezone) updateData.timezone = data.timezone;
        if (data.meetingLink !== undefined) updateData.meetingLink = data.meetingLink;
        if (data.meetingPassword !== undefined) updateData.meetingPassword = data.meetingPassword;
        if (data.platform) updateData.platform = data.platform;
        if (data.fee !== undefined) updateData.fee = parseFloat(data.fee);
        if (data.maxParticipants !== undefined) {
            updateData.maxParticipants = data.maxParticipants ? parseInt(data.maxParticipants) : null;
        }
        if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;

        const updated = await prisma.mentorshipClass.update({
            where: { id },
            data: updateData,
        });

        return updated;
    }

    // Cancel class
    async cancelClass(id: string) {
        const updated = await prisma.mentorshipClass.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });

        return updated;
    }

    // Complete class
    async completeClass(id: string) {
        const updated = await prisma.mentorshipClass.update({
            where: { id },
            data: { status: 'COMPLETED' },
        });

        return updated;
    }

    // Delete class
    async deleteClass(id: string) {
        await prisma.mentorshipClass.delete({
            where: { id },
        });

        return { message: 'Class deleted successfully' };
    }

    // Get registrations for a class
    async getRegistrations(classId: string) {
        const registrations = await prisma.classRegistration.findMany({
            where: { classId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return registrations;
    }

    // Approve payment
    async approvePayment(registrationId: string) {
        const updated = await prisma.classRegistration.update({
            where: { id: registrationId },
            data: { paymentStatus: 'PAID' },
        });

        return updated;
    }

    // Get statistics
    async getClassStats() {
        const [upcoming, completed, cancelled, totalRevenue] = await Promise.all([
            prisma.mentorshipClass.count({
                where: { status: 'SCHEDULED' },
            }),
            prisma.mentorshipClass.count({
                where: { status: 'COMPLETED' },
            }),
            prisma.mentorshipClass.count({
                where: { status: 'CANCELLED' },
            }),
            prisma.classRegistration.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { amountPaid: true },
            }),
        ]);

        const totalRegistrations = await prisma.classRegistration.count();

        return {
            upcoming,
            completed,
            cancelled,
            totalRegistrations,
            totalRevenue: totalRevenue._sum.amountPaid || 0,
        };
    }
}

export default new MentorshipService();
