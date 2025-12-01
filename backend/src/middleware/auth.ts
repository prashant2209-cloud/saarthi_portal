import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';
import User, { IUser } from '../models/User';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export interface AuthRequest extends Request {
  user?: IUser;
  auth?: {
    userId: string;
    sessionId: string;
  };
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // Verify token using Clerk
    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    const clerkId = verifiedToken.sub;

    if (!clerkId) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
      });
    }

    // Find user in local DB
    let user = await User.findOne({ clerkId });

    // Sync user if not found (First time login)
    if (!user) {
      try {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = clerkUser.fullName || clerkUser.firstName || 'User';
        const avatar = clerkUser.imageUrl;

        if (email) {
          user = await User.create({
            clerkId,
            name,
            email,
            avatar,
            role: 'user',
          });
        }
      } catch (syncError) {
        console.error('Error syncing user from Clerk:', syncError);
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User not found in local database.',
      });
    }

    (req as AuthRequest).user = user;
    (req as AuthRequest).auth = { userId: clerkId, sessionId: verifiedToken.sid || '' };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Access denied. Invalid token.',
    });
  }
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const verifiedToken = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    const clerkId = verifiedToken.sub;
    if (clerkId) {
      const user = await User.findOne({ clerkId });
      if (user) {
        (req as AuthRequest).user = user;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, just proceed without user
    next();
  }
};
