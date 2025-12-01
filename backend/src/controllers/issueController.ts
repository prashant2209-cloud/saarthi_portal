import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Issue from '../models/Issue';

export const getIssues = async (req: Request, res: Response) => {
    try {
        const { status, priority, category, limit = 10, page = 1 } = req.query;
        const query: any = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        const issues = await Issue.find(query)
            .populate('reportedBy', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Issue.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                issues,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)),
                },
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createIssue = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, category, priority, location, images } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const issue = await Issue.create({
            title,
            description,
            category,
            priority,
            location,
            images,
            reportedBy: user._id,
        });

        // Update user stats
        user.issuesReported += 1;
        await user.save();

        res.status(201).json({ success: true, data: issue });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getIssueById = async (req: Request, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id).populate('reportedBy', 'name avatar');
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        // Increment view count
        issue.viewCount += 1;
        await issue.save();

        res.status(200).json({ success: true, data: issue });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        if (issue.reportedBy.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updatedIssue });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        if (issue.reportedBy.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await issue.deleteOne();
        res.status(200).json({ success: true, message: 'Issue deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const upvoteIssue = async (req: AuthRequest, res: Response) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({ success: false, message: 'Issue not found' });
        }

        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const index = issue.upvotes.indexOf(userId);
        if (index === -1) {
            issue.upvotes.push(userId);
        } else {
            issue.upvotes.splice(index, 1);
        }

        await issue.save();
        res.status(200).json({ success: true, data: issue });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
        const pendingIssues = await Issue.countDocuments({ status: 'Pending' });
        const inProgressIssues = await Issue.countDocuments({ status: 'In Progress' });

        // Calculate total upvotes
        const allIssues = await Issue.find().select('upvotes viewCount');
        const totalUpvotes = allIssues.reduce((acc, curr) => acc + curr.upvotes.length, 0);
        const totalViews = allIssues.reduce((acc, curr) => acc + curr.viewCount, 0);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalIssues,
                    resolvedIssues,
                    pendingIssues,
                    inProgressIssues,
                    totalUpvotes,
                    totalViews
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
