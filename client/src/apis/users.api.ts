import { LoginResponse } from '../types/Reponse.type'
import { RegisterType, User } from '../types/User.type'
import { SuccessResponse } from '../types/Utils.type'
import http from '../utils/http'

const apiUser = {
    getUserProfile: () => http.get<SuccessResponse<User>>('/users/me'),
    getAllUsers: (access_token: string) =>
        http.get<SuccessResponse<{ result: { _id: string; name: string }[] }>>('/users/all', {
            headers: { Authorization: `Bearer ${access_token}` },
        }),
    registerUser: (body: RegisterType[]) => http.post<SuccessResponse<User>>('/users/register', body),
    loginUser: (body: Pick<RegisterType, 'email' | 'password'>) =>
        http.post<SuccessResponse<LoginResponse>>('/users/login', body),
    getProfile: () => http.get<SuccessResponse<User>>('/users/me'),
    getFollowing: () => http.get<SuccessResponse<User[]>>('/users/me/following'),
    getFollowers: () => http.get<SuccessResponse<User[]>>('/users/me/followers'),
    getProfileByUserName: (username: string) => http.get<SuccessResponse<User>>(`/users/${username}`),
    getProfileById: (user_id: string) => http.get<SuccessResponse<User>>(`/users/profile/${user_id}`),


    // Thêm các API mới cho Forgot Password
    forgotPassword: (body: { email: string }) =>
        http.post<SuccessResponse<{ message: string }>>('/users/forgot-password', body),
    verifyForgotPasswordToken: (body: { forgot_password_token: string }) =>
        http.post<SuccessResponse<{ message: string }>>('/users/verify-forgot-password', body),
    resetPassword: (body: { password: string; confirm_password: string; forgot_password_token: string }) =>
        http.post<SuccessResponse<{ message: string }>>('/users/reset-password', body),

    resendVerifyEmail: () =>
        http.post<SuccessResponse<{ message: string }>>('/users/resend-verify-email'),
};

export default apiUser

