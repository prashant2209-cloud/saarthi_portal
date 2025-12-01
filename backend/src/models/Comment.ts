import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    content: string;
    issue: mongoose.Types.ObjectId;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        content: { type: String, required: true },
        issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IComment>('Comment', CommentSchema);
