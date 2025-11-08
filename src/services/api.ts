import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; location?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: { name?: string; location?: string; bio?: string }) =>
    api.put('/auth/profile', data),
};

// Issues API
export const issuesAPI = {
  getIssues: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    priority?: string;
    location?: string;
    search?: string;
    sort?: string;
  }) => api.get('/issues', { params }),

  getIssue: (id: string) => api.get(`/issues/${id}`),

  createIssue: (data: {
    title: string;
    description: string;
    category: string;
    location: { address: string; coordinates?: { lat: number; lng: number } };
    images?: string[];
    priority?: string;
  }) => api.post('/issues', data),

  updateIssue: (id: string, data: {
    title?: string;
    description?: string;
    category?: string;
    location?: { address: string; coordinates?: { lat: number; lng: number } };
    images?: string[];
    status?: string;
  }) => api.put(`/issues/${id}`, data),

  deleteIssue: (id: string) => api.delete(`/issues/${id}`),

  toggleUpvote: (id: string) => api.post(`/issues/${id}/upvote`),

  getStats: () => api.get('/issues/stats'),
};

// Comments API
export const commentsAPI = {
  getComments: (issueId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/issues/${issueId}/comments`, { params }),

  createComment: (issueId: string, data: { content: string; parentCommentId?: string }) =>
    api.post(`/issues/${issueId}/comments`, data),

  updateComment: (commentId: string, data: { content: string }) =>
    api.put(`/comments/${commentId}`, data),

  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),

  toggleUpvote: (commentId: string) => api.post(`/comments/${commentId}/upvote`),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  bio?: string;
  role: 'user' | 'admin';
  issuesReported: number;
  issuesResolved: number;
  reputation: number;
  createdAt: string;
}

export interface Issue {
  id: string;
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
  reportedBy: User;
  assignedTo?: User;
  upvotes: string[];
  comments: string[];
  tags: string[];
  metadata: {
    views: number;
    shares: number;
    lastActivity: string;
  };
  upvoteCount: number;
  commentCount: number;
  timeAgo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  issue: string;
  parentComment?: string;
  replies: Comment[];
  upvotes: string[];
  isEdited: boolean;
  editedAt?: string;
  upvoteCount: number;
  replyCount: number;
  timeAgo: string;
  createdAt: string;
  updatedAt: string;
}

export interface IssueStats {
  overview: {
    totalIssues: number;
    pendingIssues: number;
    inProgressIssues: number;
    resolvedIssues: number;
    totalUpvotes: number;
    totalViews: number;
  };
  categories: Array<{
    _id: string;
    count: number;
  }>;
}
