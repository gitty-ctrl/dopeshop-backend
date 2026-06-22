import { PrismaClient } from '@prisma/client';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';
import { JwtUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';

const prisma = new PrismaClient();

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    // Check if exists
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error('Email already registered');

    // Validate password
    if (data.password.length < 8) {
      throw new Error('Password must be 8+ characters');
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        balance: 50.00,
      },
    });

    // Generate tokens
    const token = JwtUtils.generateToken({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    const refreshToken = JwtUtils.generateRefreshToken({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        subscriptionTier: user.subscriptionTier,
        balance: user.balance,
        latitude: user.latitude,
        longitude: user.longitude,
      },
      token,
      refreshToken,
    };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new Error('User not found');

    const passwordValid = await PasswordUtils.comparePasswords(
      data.password,
      user.password
    );

    if (!passwordValid) throw new Error('Invalid password');

    const token = JwtUtils.generateToken({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    const refreshToken = JwtUtils.generateRefreshToken({
      id: user.id,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        subscriptionTier: user.subscriptionTier,
        balance: user.balance,
        latitude: user.latitude,
        longitude: user.longitude,
      },
      token,
      refreshToken,
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        latitude: true,
        longitude: true,
        subscriptionTier: true,
        balance: true,
        lastMoneyUpdate: true,
        aiMessagesThisMonth: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error('User not found');
    return user;
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const payload = JwtUtils.verifyRefreshToken(refreshToken);
    if (!payload) throw new Error('Invalid refresh token');

    const newToken = JwtUtils.generateToken(payload);
    return { token: newToken };
  }

  static async addDailyMoney(userId: string): Promise<{ balance: number }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error('User not found');

    // Check if already received today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastMoneyUpdate && user.lastMoneyUpdate >= today) {
      return { balance: user.balance };
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: 25 },
        lastMoneyUpdate: new Date(),
      },
    });

    return { balance: updated.balance };
  }
}