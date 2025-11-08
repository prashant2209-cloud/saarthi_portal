import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reportedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  upvotes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  tags: string[];
  resolution?: {
    description: string;
    resolvedAt: Date;
    resolvedBy: mongoose.Types.ObjectId;
  };
  metadata: {
    views: number;
    shares: number;
    lastActivity: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Location address is required'],
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [{
      type: String,
      validate: {
        validator: function(v: string[]) {
          return v.length <= 5; // Maximum 5 images
        },
        message: 'Cannot upload more than 5 images',
      },
    }],
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    upvotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    resolution: {
      description: String,
      resolvedAt: Date,
      resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    metadata: {
      views: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
      lastActivity: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
issueSchema.index({ category: 1, status: 1 });
issueSchema.index({ location: '2dsphere' }); // For geospatial queries
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ 'metadata.lastActivity': -1 });
issueSchema.index({ tags: 1 });

// Virtual for upvote count
issueSchema.virtual('upvoteCount').get(function () {
  return this.upvotes.length;
});

// Virtual for comment count
issueSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual for time since creation
issueSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diff = now.getTime() - this.createdAt.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
});

// Pre-save middleware to update lastActivity
issueSchema.pre('save', function (next) {
  this.metadata.lastActivity = new Date();
  next();
});

const Issue = mongoose.model<IIssue>('Issue', issueSchema);

export default Issue;
