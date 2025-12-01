import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Comment from '../models/Comment';

export const getComments = async (req: Request, res: Response) => {
    try {
        const comments = await Comment.find({ issue: req.params.issueId })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: comments });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const { content } = req.body;
        const { issueId } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const comment = await Comment.create({
            content,
            issue: issueId,
            author: user._id,
        });

        const populatedComment = await comment.populate('author', 'name avatar');

        res.status(201).json({ success: true, data: populatedComment });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await comment.deleteOne();
        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
