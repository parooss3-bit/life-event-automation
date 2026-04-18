import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateTokens = (userId: string, email: string, tier: string) => {
  const accessToken = jwt.sign(
    {
      sub: userId,
      email,
      tier,
    },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: process.env.JWT_EXPIRATION || '24h',
    }
  );

  const refreshToken = jwt.sign(
    {
      sub: userId,
      type: 'refresh',
    },
    process.env.REFRESH_TOKEN_SECRET || 'refresh-secret',
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '30d',
    }
  );

  return { accessToken, refreshToken };
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret') as any;
  } catch (error) {
    return null;
  }
};
