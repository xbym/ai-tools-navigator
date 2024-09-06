import { NextRequest, NextResponse } from 'next/server';
import { GET, PUT } from './route';
import { authMiddleware } from '@/middleware/authMiddleware';
import User from '@/models/User';
import mongoose from 'mongoose';

jest.mock('@/middleware/authMiddleware');
jest.mock('@/models/User', () => ({
  findById: jest.fn().mockReturnThis(),
  select: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    url,
    headers: new Map(),
    json: jest.fn().mockResolvedValue(options?.body || {}),
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

      expect(res.status).toBe(200);
      const jsonResponse = await res.json();
      expect(jsonResponse).toEqual(mockUser);
    });

    it('should return 404 if user not found', async () => {
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null)
      }));
      (authMiddleware as jest.Mock).mockImplementation((req, handler) => handler(req, '123'));

      const req = new NextRequest('http://localhost/api/users/profile') as unknown as NextRequest;
      const res = await GET(req);

      expect(res.status).toBe(404);
      const jsonResponse = await res.json();
      expect(jsonResponse).toEqual({ message: '用户不存在' });
    });
  });

  describe('PUT', () => {
    it('should update user profile', async () => {
      const updatedUser = { _id: '123', username: 'updateduser', email: 'updated@example.com' };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
      (authMiddleware as jest.Mock).mockImplementation((req, handler) => handler(req, '123'));

      const req = new NextRequest('http://localhost/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ username: 'updateduser', email: 'updated@example.com' }),
      }) as unknown as NextRequest;
      const res = await PUT(req);

      expect(res.status).toBe(200);
      const jsonResponse = await res.json();
      expect(jsonResponse).toEqual(updatedUser);
    });

    it('should return 404 if user not found during update', async () => {
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      (authMiddleware as jest.Mock).mockImplementation((req, handler) => handler(req, '123'));

      const req = new NextRequest('http://localhost/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ username: 'updateduser', email: 'updated@example.com' }),
      }) as unknown as NextRequest;
      const res = await PUT(req);

      expect(res.status).toBe(404);
      const jsonResponse = await res.json();
      expect(jsonResponse).toEqual({ message: '用户不存在' });
    });
  });
});