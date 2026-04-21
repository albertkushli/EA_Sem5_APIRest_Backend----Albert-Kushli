import { Request, Response } from 'express';
import { getActivities } from '../services/activityService';

export const listActivities = async (req: Request, res: Response) => {
    const activities = await getActivities();
    res.json(activities);
};
