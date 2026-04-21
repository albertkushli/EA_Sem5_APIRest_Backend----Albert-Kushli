import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
    action: string;               // create | update | delete
    entity: string;               // user | organization
    entityId: mongoose.Types.ObjectId; 
    timestamp: Date;
}

export interface IActivityModel extends IActivity, Document {}

const ActivitySchema: Schema = new Schema(
    {
        action: { type: String, required: true },
        entity: { type: String, required: true },
        entityId: { type: Schema.Types.ObjectId, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IActivityModel>('Activity', ActivitySchema);
