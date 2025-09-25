import express from 'express';
import {
  getAdminIssues,
  updateIssueStatus,
  assignIssue,
  getAdminStats
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin/authority role
router.use(authenticate);
router.use(authorize('admin', 'authority'));

router.get('/issues', getAdminIssues);
router.get('/stats', getAdminStats);
router.patch('/issues/:id/status', validateObjectId('id'), updateIssueStatus);
router.patch('/issues/:id/assign', validateObjectId('id'), assignIssue);

export default router;