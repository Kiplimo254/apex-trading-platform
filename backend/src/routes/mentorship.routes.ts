import { Router } from 'express';
import mentorshipController from '../controllers/mentorship.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// ============ USER ROUTES ============

// Get upcoming classes (public)
router.get('/classes', mentorshipController.getUpcomingClasses);

// Get class by ID (public)
router.get('/classes/:id', mentorshipController.getClassById);

// Get user's registered classes (authenticated)
router.get('/my-classes', authenticate, mentorshipController.getMyClasses);

// Register for a class (authenticated)
router.post('/register/:classId', authenticate, mentorshipController.registerForClass);

// Get meeting link (authenticated)
router.get('/meeting-link/:classId', authenticate, mentorshipController.getMeetingLink);

// Mark attendance (authenticated)
router.post('/mark-attendance/:classId', authenticate, mentorshipController.markAttendance);

// ============ ADMIN ROUTES ============

// Get all classes (admin)
router.get('/admin/classes', authenticate, requireAdmin, mentorshipController.getAllClasses);

// Create class (admin)
router.post('/admin/classes', authenticate, requireAdmin, mentorshipController.createClass);

// Update class (admin)
router.put('/admin/classes/:id', authenticate, requireAdmin, mentorshipController.updateClass);

// Cancel class (admin)
router.patch('/admin/classes/:id/cancel', authenticate, requireAdmin, mentorshipController.cancelClass);

// Complete class (admin)
router.patch('/admin/classes/:id/complete', authenticate, requireAdmin, mentorshipController.completeClass);

// Delete class (admin)
router.delete('/admin/classes/:id', authenticate, requireAdmin, mentorshipController.deleteClass);

// Get registrations for a class (admin)
router.get('/admin/classes/:id/registrations', authenticate, requireAdmin, mentorshipController.getRegistrations);

// Approve payment (admin)
router.patch('/admin/registrations/:id/approve', authenticate, requireAdmin, mentorshipController.approvePayment);

// Get statistics (admin)
router.get('/admin/stats', authenticate, requireAdmin, mentorshipController.getStats);

export default router;
