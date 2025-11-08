import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import Issue from '../models/Issue';
import User from '../models/User';
import Comment from '../models/Comment';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all issues with filtering and pagination
// @route   GET /api/issues
// @access  Public
export const getIssues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    // Build query
    let query: any = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by location (simple text search)
    if (req.query.location) {
      query['location.address'] = { $regex: req.query.location, $options: 'i' };
    }

    // Search in title and description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Sort options
    let sortOptions: any = { createdAt: -1 }; // Default: newest first
    if (req.query.sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (req.query.sort === 'popular') {
      sortOptions = { 'metadata.views': -1 };
    } else if (req.query.sort === 'urgent') {
      sortOptions = { priority: -1, createdAt: -1 };
    }

    // Execute query
    const issues = await Issue.find(query)
      .populate('reportedBy', 'name avatar location')
      .populate('assignedTo', 'name avatar')
      .sort(sortOptions)
      .limit(limit)
      .skip(startIndex)
      .lean();

    // Get total count for pagination
    const total = await Issue.countDocuments(query);

    // Add virtual fields
    const issuesWithVirtuals = issues.map(issue => ({
      ...issue,
      upvoteCount: issue.upvotes?.length || 0,
      commentCount: issue.comments?.length || 0,
      timeAgo: getTimeAgo(issue.createdAt),
    }));

    res.status(200).json({
      success: true,
      data: {
        issues: issuesWithVirtuals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
export const getIssue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name avatar location bio reputation')
      .populate('assignedTo', 'name avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name avatar',
        },
        options: { sort: { createdAt: 1 } },
      });

    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    // Increment view count
    await Issue.findByIdAndUpdate(req.params.id, {
      $inc: { 'metadata.views': 1 },
    });

    res.status(200).json({
      success: true,
      data: {
        issue: {
          ...issue.toObject(),
          upvoteCount: issue.upvotes.length,
          commentCount: issue.comments.length,
          timeAgo: getTimeAgo(issue.createdAt),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { title, description, category, location, images, priority } = req.body;

    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      images: images || [],
      priority: priority || 'Medium',
      reportedBy: req.user._id,
    });

    // Update user's issue count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { issuesReported: 1 },
    });

    // Populate the created issue
    await issue.populate('reportedBy', 'name avatar location');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      data: {
        issue: {
          ...issue.toObject(),
          upvoteCount: 0,
          commentCount: 0,
          timeAgo: 'Just now',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private (Owner or Admin)
export const updateIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    // Check ownership or admin role
    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this issue',
      });
      return;
    }

    const { title, description, category, location, images, status } = req.body;

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        location,
        images,
        status: req.user.role === 'admin' ? status : issue.status,
      },
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name avatar location');

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: {
        issue: {
          ...updatedIssue!.toObject(),
          upvoteCount: updatedIssue!.upvotes.length,
          commentCount: updatedIssue!.comments.length,
          timeAgo: getTimeAgo(updatedIssue!.createdAt),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private (Owner or Admin)
export const deleteIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    // Check ownership or admin role
    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this issue',
      });
      return;
    }

    // Delete associated comments
    await Comment.deleteMany({ issue: req.params.id });

    // Delete the issue
    await Issue.findByIdAndDelete(req.params.id);

    // Update user's issue count
    await User.findByIdAndUpdate(issue.reportedBy, {
      $inc: { issuesReported: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote/Downvote issue
// @route   POST /api/issues/:id/upvote
// @access  Private
export const toggleUpvote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    const userId = req.user._id;
    const hasUpvoted = issue.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      issue.upvotes = issue.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      issue.upvotes.push(userId);
    }

    await issue.save();

    res.status(200).json({
      success: true,
      data: {
        upvoteCount: issue.upvotes.length,
        hasUpvoted: !hasUpvoted,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issue statistics
// @route   GET /api/issues/stats
// @access  Public
export const getIssueStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: null,
          totalIssues: { $sum: 1 },
          pendingIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          inProgressIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] },
          },
          resolvedIssues: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
          },
          totalUpvotes: { $sum: { $size: '$upvotes' } },
          totalViews: { $sum: '$metadata.views' },
        },
      },
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalIssues: 0,
          pendingIssues: 0,
          inProgressIssues: 0,
          resolvedIssues: 0,
          totalUpvotes: 0,
          totalViews: 0,
        },
        categories: categoryStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

// Validation rules
export const createIssueValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .isIn([
      'Roads & Potholes',
      'Water Supply',
      'Garbage & Sanitation',
      'Street Lights',
      'Drainage',
      'Public Safety',
      'Traffic & Parking',
      'Public Transport',
      'Electricity',
      'Healthcare',
      'Education',
      'Other',
    ])
    .withMessage('Invalid category'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Location address is required'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority level'),
];

export const updateIssueValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .isIn([
      'Roads & Potholes',
      'Water Supply',
      'Garbage & Sanitation',
      'Street Lights',
      'Drainage',
      'Public Safety',
      'Traffic & Parking',
      'Public Transport',
      'Electricity',
      'Healthcare',
      'Education',
      'Other',
    ])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    .withMessage('Invalid status'),
];
