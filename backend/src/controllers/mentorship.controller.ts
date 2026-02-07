import { Request, Response } from 'express';
import mentorshipService from '../services/mentorship.service';

class MentorshipController {
    // ============ USER ENDPOINTS ============

    // Get upcoming classes
    async getUpcomingClasses(req: Request, res: Response) {
        try {
            const { category } = req.query;
            const classes = await mentorshipService.getUpcomingClasses(category as string);

            res.json({
                success: true,
                data: classes,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get class by ID
    async getClassById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const classData = await mentorshipService.getClassById(id);

            if (!classData) {
                return res.status(404).json({
                    success: false,
                    message: 'Class not found',
                });
            }

            res.json({
                success: true,
                data: classData,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get user's registered classes
    async getMyClasses(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const registrations = await mentorshipService.getUserRegisteredClasses(userId);

            res.json({
                success: true,
                data: registrations,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Register for a class
    async registerForClass(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { classId } = req.params;

            const registration = await mentorshipService.registerForClass(userId, classId);

            res.json({
                success: true,
                message: 'Successfully registered for class',
                data: registration,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get meeting link
    async getMeetingLink(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { classId } = req.params;

            const meetingInfo = await mentorshipService.getMeetingLink(userId, classId);

            res.json({
                success: true,
                data: meetingInfo,
            });
        } catch (error: any) {
            res.status(403).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Mark attendance
    async markAttendance(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { classId } = req.params;

            const updated = await mentorshipService.markAttendance(userId, classId);

            res.json({
                success: true,
                message: 'Attendance marked',
                data: updated,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ============ ADMIN ENDPOINTS ============

    // Get all classes
    async getAllClasses(req: Request, res: Response) {
        try {
            const { status } = req.query;
            const classes = await mentorshipService.getAllClasses(status as string);

            res.json({
                success: true,
                data: classes,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Create class
    async createClass(req: Request, res: Response) {
        try {
            const classData = await mentorshipService.createClass(req.body);

            res.status(201).json({
                success: true,
                message: 'Class created successfully',
                data: classData,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update class
    async updateClass(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await mentorshipService.updateClass(id, req.body);

            res.json({
                success: true,
                message: 'Class updated successfully',
                data: updated,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Cancel class
    async cancelClass(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await mentorshipService.cancelClass(id);

            res.json({
                success: true,
                message: 'Class cancelled',
                data: updated,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Complete class
    async completeClass(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await mentorshipService.completeClass(id);

            res.json({
                success: true,
                message: 'Class marked as completed',
                data: updated,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Delete class
    async deleteClass(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await mentorshipService.deleteClass(id);

            res.json({
                success: true,
                message: 'Class deleted successfully',
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get registrations for a class
    async getRegistrations(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const registrations = await mentorshipService.getRegistrations(id);

            res.json({
                success: true,
                data: registrations,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Approve payment
    async approvePayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updated = await mentorshipService.approvePayment(id);

            res.json({
                success: true,
                message: 'Payment approved',
                data: updated,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get statistics
    async getStats(req: Request, res: Response) {
        try {
            const stats = await mentorshipService.getClassStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new MentorshipController();
