// ~/pages/User/ResetPassword.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import apiUser from '../../../apis/users.api';
import path from '../../../constants/path';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Lấy 'token' từ query parameter
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (body: { password: string; confirm_password: string; forgot_password_token: string }) =>
      apiUser.resetPassword(body),
  });

  const handleChange = (field: 'password' | 'confirm_password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing token. Please use the link from your email.');
      navigate(path.login);
      return;
    }
    // Kiểm tra password và confirm_password có khớp nhau không
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    resetPasswordMutation.mutate(
      { ...formData, forgot_password_token: token },
      {
        onSuccess: (res) => {
          console.log('Reset password success:', res.data); // Debug
          toast.success('Password reset successfully. You can now log in.');
          setTimeout(() => navigate(path.login), 2000); // Chờ 2 giây trước khi chuyển hướng
        },
        onError: (error: any) => {
          console.log('Reset password error:', error?.response?.data); // Debug
          toast.error(error?.response?.data?.message || 'Failed to reset password. Please try again.');
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex-col bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <h1 className="text-3xl text-white font-light mb-2 text-center pt-8">Reset Password</h1>
        <p className="text-white/50 text-center text-sm mb-8">Enter your new password</p>

        <form onSubmit={handleSubmit} className="space-y-6 p-8 relative z-10">
          <div className="relative">
            <label className="absolute text-white/70 top-3 left-4 pointer-events-none">New Password</label>
            <input
              value={formData.password}
              onChange={handleChange('password')}
              type="password"
              className="w-full px-4 pt-6 pb-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
              required
            />
          </div>

          <div className="relative">
            <label className="absolute text-white/70 top-3 left-4 pointer-events-none">Confirm Password</label>
            <input
              value={formData.confirm_password}
              onChange={handleChange('confirm_password')}
              type="password"
              className="w-full px-4 pt-6 pb-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full px-6 py-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm text-white rounded-md transition-colors duration-200 border border-blue-500/30"
          >
            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="px-8 pb-8 text-center text-white/50 text-sm">
          Back to{' '}
          <Link to={path.login} className="text-blue-400 hover:text-blue-300 font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}