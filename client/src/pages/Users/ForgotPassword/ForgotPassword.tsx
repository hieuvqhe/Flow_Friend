// ~/pages/User/ForgotPassword.tsx
import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiUser from '../../../apis/users.api';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../../constants/path';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const forgotPasswordMutation = useMutation({
        mutationFn: (body: { email: string }) => apiUser.forgotPassword(body),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        forgotPasswordMutation.mutate(
            { email },
            {
                onSuccess: (res) => {
                    // Thay vì hiển thị chuỗi thô, dùng thông điệp thân thiện
                    toast.success('Please check your email to reset your password.');
                },
                onError: (error: any) => {
                    toast.error(error?.response?.data?.message || 'Failed to send reset link. Please try again.');
                },
            }
        );
    };

    return (
        <div className="min-h-screen w-full flex-col bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
                <h3 className="text-3xl text-white font-light mb-2 text-center pt-8">Forgot Password</h3>
                <p className="text-white/50 text-center text-sm mb-8">Enter your email to reset your password</p>

                <form onSubmit={handleSubmit} className="space-y-6 p-8 relative z-10">
                    <div className="relative">
                        <label className="absolute text-white/70 top-3 left-4 pointer-events-none">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="w-full px-4 pt-6 pb-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={forgotPasswordMutation.isPending}
                        className="w-full px-6 py-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm text-black rounded-md transition-colors duration-200 border border-blue-500/30"
                    >
                        {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
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
