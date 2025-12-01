import mongoose, { Schema, Document } from 'mongoose';

export interface IIssue extends Document {
    title: string;
    description: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Resolved';
    location: string;
    images: string[];
    reportedBy: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId;
    upvotes: mongoose.Types.ObjectId[];
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
        status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
        location: { type: String, required: true },
        images: [{ type: String }],
        reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
        upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        viewCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IIssue>('Issue', IssueSchema);
