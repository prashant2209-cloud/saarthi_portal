import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Comment from '../models/Comment';
import Issue from '../models/Issue';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get comments for an issue
// @route   GET /api/issues/:issueId/comments
// @access  Public
export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { issueId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const startIndex = (page - 1) * limit;

    // Check if issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      issue: issueId,
      parentComment: null,
    })
      .populate('author', 'name avatar reputation')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name avatar',
        },
        options: { sort: { createdAt: 1 } },
      })
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(startIndex)
      .lean();

    // Get total count
    const total = await Comment.countDocuments({
      issue: issueId,
      parentComment: null,
    });

    // Add virtual fields
    const commentsWithVirtuals = comments.map(comment => ({
      ...comment,
      upvoteCount: comment.upvotes?.length || 0,
      replyCount: comment.replies?.length || 0,
      timeAgo: getTimeAgo(comment.createdAt),
    }));

    res.status(200).json({
      success: true,
      data: {
        comments: commentsWithVirtuals,
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

// @desc    Create a comment
// @route   POST /api/issues/:issueId/comments
// @access  Private
export const createComment = async (
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

    const { issueId } = req.params;
    const { content, parentCommentId } = req.body;

    // Check if issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      res.status(404).json({
        success: false,
        message: 'Issue not found',
      });
      return;
    }

    // If replying to a comment, check if parent exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
        return;
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      author: req.user._id,
      issue: issueId,
      parentComment: parentCommentId || null,
    });

    // If it's a reply, add to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      });
    }

    // Update issue's comment count and last activity
    await Issue.findByIdAndUpdate(issueId, {
      $push: { comments: comment._id },
      $set: { 'metadata.lastActivity': new Date() },
    });

    // Populate the created comment
    await comment.populate('author', 'name avatar reputation');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        comment: {
          ...comment.toObject(),
          upvoteCount: 0,
          replyCount: 0,
          timeAgo: 'Just now',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (Author only)
export const updateComment = async (
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

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment',
      });
      return;
    }

    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true, runValidators: true }
    ).populate('author', 'name avatar reputation');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      data: {
        comment: {
          ...updatedComment!.toObject(),
          upvoteCount: updatedComment!.upvotes.length,
          replyCount: updatedComment!.replies.length,
          timeAgo: getTimeAgo(updatedComment!.createdAt),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Author or Admin)
export const deleteComment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    // Check ownership or admin role
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment',
      });
      return;
    }

    // If it's a reply, remove from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id },
      });
    }

    // Remove from issue's comments array
    await Issue.findByIdAndUpdate(comment.issue, {
      $pull: { comments: comment._id },
    });

    // Delete the comment and all its replies
    await Comment.deleteMany({
      $or: [
        { _id: comment._id },
        { parentComment: comment._id },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upvote/Downvote a comment
// @route   POST /api/comments/:id/upvote
// @access  Private
export const toggleCommentUpvote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
      return;
    }

    const userId = req.user._id;
    const hasUpvoted = comment.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      comment.upvotes = comment.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      comment.upvotes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      data: {
        upvoteCount: comment.upvotes.length,
        hasUpvoted: !hasUpvoted,
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
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
};

// Validation rules
export const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
  param('issueId')
    .isMongoId()
    .withMessage('Invalid issue ID'),
];

export const updateCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters'),
];
