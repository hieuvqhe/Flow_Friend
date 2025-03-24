import { LoginResponse } from '@/types/Reponse.type'
import { RegisterType, User } from '@/types/User.type'
import { SuccessResponse } from '@/types/Utils.type'
import http from '@/utils/http'

const apiUser = {
    getUserProfile: () => http.get<SuccessResponse<User>>('/users/me'),
    getAllUsers: (page: number = 1, limit: number = 10) =>
        http.get<SuccessResponse<{ users: User[]; total: number; page: number; limit: number; totalPages: number }>>(
            `/users/all?page=${page}&limit=${limit}`
        ),
    searchUsersByName: (name: string, page: number = 1, limit: number = 10) =>
        http.get<SuccessResponse<{ users: User[]; total: number; page: number; limit: number; totalPages: number }>>(
            `/users/search?name=${encodeURIComponent(name)}&page=${page}&limit=${limit}`
        ),
    registerUser: (body: RegisterType[]) => http.post<SuccessResponse<User>>('/users/register', body),
    loginUser: (body: Pick<RegisterType, 'email' | 'password'>) =>
        http.post<SuccessResponse<LoginResponse>>('/users/login', body),
    getProfile: () => http.get<SuccessResponse<User>>('/users/me'),
    getFollowing: () => http.get<SuccessResponse<User[]>>('/users/me/following'),
    //getFollowers: () => http.get<SuccessResponse<User[]>>('/users/me/followers'),
    getFollowers: () =>
        http.get<SuccessResponse<{ result: { _id: string; name: string; avatar: string | null }[] }>>(
            '/users/me/followers'
        ),
    getProfileByUserName: (username: string) => http.get<SuccessResponse<User>>(`/users/${username}`),
    getProfileById: (user_id: string) => http.get<SuccessResponse<User>>(`/users/profile/${user_id}`),

    // Thêm API để follow và unfollow
    followUser: (followed_user_id: string) =>
        http.post<SuccessResponse<{ message: string }>>('/users/follow', { followed_user_id }),
    unfollowUser: (followed_user_id: string) =>
        http.delete<SuccessResponse<{ message: string }>>('/users/un-follow', { data: { followed_user_id } }),

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
