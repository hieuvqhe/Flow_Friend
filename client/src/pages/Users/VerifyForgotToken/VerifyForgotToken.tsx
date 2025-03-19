// ~/pages/User/VerifyForgotToken.tsx
import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiUser from '../../../apis/users.api';
import path from '../../../constants/path';

export default function VerifyForgotToken() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Thay 'forgot_password_token' thành 'token'

  const verifyForgotPasswordMutation = useMutation({
    mutationFn: (body: { forgot_password_token: string }) => apiUser.verifyForgotPasswordToken(body),
  });

  useEffect(() => {
    console.log('URL Search Params:', searchParams.toString()); // Debug: Xem query params
    console.log('Token from URL:', token); // Debug: Giá trị token

    if (!token) {
      console.log('No token found');
      toast.error('Invalid or missing token');
      navigate(path.login);
      return;
    }

    console.log('Verifying token:', token);
    verifyForgotPasswordMutation.mutate(
      { forgot_password_token: token }, // Vẫn gửi đúng key cho API
      {
        onSuccess: (res) => {
          console.log('Success:', res.data);
          toast.success("VERIFY_FORGOT_PASSWORD_SUCCESS"); // "VERIFY_FORGOT_PASSWORD_SUCCESS"
          navigate(`${path.resetPassword}?token=${token}`);
        },
        onError: (error: any) => {
          console.log('Error:', error?.response?.data);
          toast.error(error?.response?.data?.message || 'Invalid token or verification failed');
          navigate(path.login);
        },
      }
    );
  }, [token, navigate]);

  return (
    <div className="min-h-screen w-full flex-col bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <h1 className="text-3xl text-white font-light mb-2 text-center pt-8">Verifying Token</h1>
        <p className="text-white/50 text-center text-sm mb-8">
          {verifyForgotPasswordMutation.isPending
            ? 'Verifying your token...'
            : verifyForgotPasswordMutation.isSuccess
              ? 'Redirecting to reset password...'
              : 'Verification failed, redirecting to login...'}
        </p>
      </div>
    </div>
  );
}