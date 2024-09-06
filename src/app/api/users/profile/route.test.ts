import { NextRequest, NextResponse } from 'next/server';
import { GET, PUT } from './route';
import { authMiddleware } from '@/middleware/authMiddleware';
import User from '@/models/User';
import mongoose from 'mongoose';

jest.mock('@/middleware/authMiddleware');
jest.mock('@/models/User', () => ({
  findById: jest.fn().mockReturnThis(),
  select: jest.fn(),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
  NextRequest: jest.fn().mockImplementation((url) => ({
    url,
    headers: new Map(),
    // 添加其他你可能需要的 NextRequest 属性
  })),
}));

describe('User Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return user profile', async () => {
      const mockUser = { _id: '123', username: 'testuser', email: 'test@example.com' };
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser)
      }));
      (authMiddleware as jest.Mock).mockImplementation((req, handler) => handler(req, '123'));

      const req = new NextRequest('http://localhost/api/users/profile') as unknown as NextRequest;
      const res = await GET(req);

      if (res.status !== 200) {
        console.error('Unexpected response:', res);
      }

      expect(res.status).toBe(200);
      const jsonResponse = await res.json();
      expect(jsonResponse).toEqual(mockUser);
    });

    // ... 其他测试
  });

  // ... PUT 测试
});