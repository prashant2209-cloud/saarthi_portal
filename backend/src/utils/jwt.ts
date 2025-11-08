import jwt from 'jsonwebtoken';

interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  // Use type assertion to bypass TypeScript strict checking
  return (jwt.sign as any)(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};
