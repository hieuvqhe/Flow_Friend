const path = {
  home: '/home',
  login: '/auth/login',
  profile: '/user/profile',
  changePassword: '/user/changePassword',
  register: '/auth/register',
  googleLogin: '/login/oauth',
  chat: '/user/chat',
  verifyEmail: '/user/verify-email',
  forgotPassword: '/forgot-password',
  verifyForgotPassword: '/auth/verify-forgot-password',
  resetPassword: '/auth/reset-password',
  user: '/user',
  any: '*',
  no: '',
  asHome: '/',
  auth: '/auth'
} as const
export default path
