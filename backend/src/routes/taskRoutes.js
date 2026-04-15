import express from 'express';
import {
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
  getAllTasksAdmin,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All task routes are protected
router.use(protect);

router.route('/')
  .get(getMyTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

// Admin only route
router.get('/admin/all', authorize('admin'), getAllTasksAdmin);

export default router;