import Activity, { IActivityModel } from '../models/activity';

export const logActivity = async (
    action: string,
    entity: string,
    entityId: string
): Promise<IActivityModel> => {
    return Activity.create({
        action,
        entity,
        entityId
    });
};

export const getActivities = async (): Promise<IActivityModel[]> => {
    return Activity.find().sort({ timestamp: -1 });
};
