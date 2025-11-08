import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  issue: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId; // For nested replies
  replies: mongoose.Types.ObjectId[];
  upvotes: mongoose.Types.ObjectId[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    replies: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
commentSchema.index({ issue: 1, createdAt: -1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });

// Virtual for upvote count
commentSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

// Virtual for reply count
commentSchema.virtual('replyCount').get(function () {
  return this.replies.length;
});

// Pre-save middleware to update edited timestamp
commentSchema.pre('save', function (next) {
  if (this.isModified('content') && this.isNew === false) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);

export default Comment;
