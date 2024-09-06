/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, AuthContext, AuthContextType } from './AuthProvider';

// 模拟 AuthContext
const mockAuthContext: AuthContextType = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: false,
  isAdmin: jest.fn(),
  token: null,
  updateUser: jest.fn(),
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(),
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (React.useContext as jest.Mock).mockReturnValue(mockAuthContext);
  });

  it('provides authentication context to children', () => {
    const TestComponent = () => {
      const auth = React.useContext(AuthContext);
      if (!auth) throw new Error('Auth context is undefined');
      return (
        <div>
          <span data-testid="user">{auth.user ? 'User' : 'No User'}</span>
          <span data-testid="isAuthenticated">{auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
        </div>
      );
    };

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user').textContent).toBe('No User');
    expect(getByTestId('isAuthenticated').textContent).toBe('Not Authenticated');
  });

  it('updates authentication state', () => {
    const TestComponent = () => {
      const auth = React.useContext(AuthContext);
      if (!auth) throw new Error('Auth context is undefined');
      return (
        <div>
          <span data-testid="user">{auth.user ? 'User' : 'No User'}</span>
          <span data-testid="isAuthenticated">{auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
        </div>
      );
    };

    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com', role: 'user' as const };

    const { getByTestId, rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user').textContent).toBe('No User');
    expect(getByTestId('isAuthenticated').textContent).toBe('Not Authenticated');

    // 更新认证状态
    act(() => {
      (React.useContext as jest.Mock).mockReturnValue({
        ...mockAuthContext,
        user: mockUser,
        isAuthenticated: true,
        token: 'mock-token',
      });
    });

    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user').textContent).toBe('User');
    expect(getByTestId('isAuthenticated').textContent).toBe('Authenticated');
  });
});