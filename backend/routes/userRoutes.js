import express from 'express';
import { getAuthorities } from '../controllers/userController.js';

const router = express.Router();

router.get('/authorities', getAuthorities);

export default router;