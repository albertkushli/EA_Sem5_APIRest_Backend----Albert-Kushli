import { Router } from 'express';
import { listActivities } from '../controllers/activityController';

const router = Router();

router.get('/', listActivities);

export default router;
