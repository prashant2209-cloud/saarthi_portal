import { Types } from 'mongoose';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export interface IssueQuery {
  category?: string;
  status?: string;
  priority?: string;
  'location.address'?: { $regex: string; $options: string };
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export interface SortOptions {
  createdAt?: 1 | -1;
  'metadata.views'?: -1;
  priority?: -1;
}

export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: ValidationErrorDetails[];
}

export interface ValidationErrorDetails {
  message: string;
  path: string;
  value: unknown;
}

export interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
  };
}
