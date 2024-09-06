/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // 添加这行
import EditProfileForm from './EditProfileForm';
import { AuthContext } from './AuthProvider';

const mockUpdateUser = jest.fn();
const mockUser = { id: '123', username: 'testuser', email: 'test@example.com', role: 'user' as const };

const mockAuthContext = {
  user: mockUser,
  updateUser: mockUpdateUser,
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true,
  isAdmin: jest.fn(() => false),
  token: 'mock-token',
};

describe('EditProfileForm', () => {
  it('renders correctly with user data', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <EditProfileForm onCancel={jest.fn()} onSuccess={jest.fn()} />
      </AuthContext.Provider>
    );

    expect(screen.getByLabelText('用户名')).toHaveValue('testuser');
    expect(screen.getByLabelText('电子邮件')).toHaveValue('test@example.com');
  });

  it('calls updateUser when form is submitted', async () => {
    const onSuccessMock = jest.fn();
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <EditProfileForm onCancel={jest.fn()} onSuccess={onSuccessMock} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText('用户名'), { target: { value: 'newusername' } });
    fireEvent.submit(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ username: 'newusername', email: 'test@example.com' });
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('displays error message on update failure', async () => {
    mockUpdateUser.mockRejectedValueOnce(new Error('Update failed'));
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <EditProfileForm onCancel={jest.fn()} onSuccess={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.submit(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(screen.getByText('更新个人资料失败')).toBeInTheDocument();
    });
  });
});