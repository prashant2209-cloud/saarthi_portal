import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    clerkId: string;
    name: string;
    email: string;
    avatar?: string;
    location?: string;
    bio?: string;
    role: 'user' | 'admin';
    issuesReported: number;
    issuesResolved: number;
    reputation: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        clerkId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        avatar: { type: String },
        location: { type: String },
        bio: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        issuesReported: { type: Number, default: 0 },
        issuesResolved: { type: Number, default: 0 },
        reputation: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
