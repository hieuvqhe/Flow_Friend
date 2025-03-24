import { Router } from "express";
import {
  followController,
  unFollowController,
  getFollowersController,
  getFollowingController,
  loginController,
  oauthController,
  registerController,
  logoutController,
  refreshTokenController,
  resendVerifyEmailController,
  resetPasswordController,
  VerifyForgotPasswordController,
  emailVerifyController,
  forgotPasswordController,
  getProfileUserByIdController,
  updateMyProfileController,
  getAllUsersController,
  searchUsersByNameController

} from "../controllers/user.controllers";
import {
  followValidator,
  AccessTokenValidator,
  verifiedUserValidator,
  loginValidator,
  registerValidator,
  RefreshTokenValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
} from "../middlewares/users.middlewares";
import { wrapAsync } from '../utils/handler'
const usersRouter = Router()

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login success
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
usersRouter.post('/login', loginValidator, wrapAsync(loginController))
usersRouter.get('/oauth/google', wrapAsync(oauthController))

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *               - date_of_birth
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               confirm_password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               date_of_birth:
 *                 type: string
 *                 format: date-time
 *                 example: "1990-01-01T00:00:00Z"
 *     responses:
 *       201:
 *         description: User registered successfully. Verification email sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refresh_token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: |
 *           Invalid input:
 *           - Password confirmation mismatch
 *           - Invalid date format
 *           - Missing required fields
 *       409:
 *         description: Email already exists
 */
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

usersRouter.post('/logout', AccessTokenValidator, RefreshTokenValidator, wrapAsync(logoutController))

/**
 * Description: refresh token
 * Path: /refresh-token
 * method: POST
 * Header: {refresh_token: string}
 */
/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Get a new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Refresh token success
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *       401:
 *         description: Invalid refresh token
 */
usersRouter.post('/refresh-token', RefreshTokenValidator, wrapAsync(refreshTokenController))

/**
 * @swagger
 * /users/verify-email:
 *   post:
 *     summary: Verify user email with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email_verify_token
 *             properties:
 *               email_verify_token:
 *                 type: string
 *                 description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))

/**
 * @swagger
 * /users/resend-verify-email:
 *   post:
 *     summary: Resend email verification token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       401:
 *         description: Unauthorized
 */
usersRouter.post('/resend-verify-email', AccessTokenValidator, wrapAsync(resendVerifyEmailController))

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: Email not found
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 * @swagger
 * /users/verify-forgot-password:
 *   post:
 *     summary: Verify forgot password token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forgot_password_token
 *             properties:
 *               forgot_password_token:
 *                 type: string
 *                 description: Forgot password token
 *     responses:
 *       200:
 *         description: Token verified successfully
 *       400:
 *         description: Invalid or expired token
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(VerifyForgotPasswordController)
)

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forgot_password_token
 *               - password
 *               - confirm_password
 *             properties:
 *               forgot_password_token:
 *                 type: string
 *                 description: Forgot password token
 *               password:
 *                 type: string
 *                 description: New password
 *               confirm_password:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid input or token
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

/**
 * Description: Get all users 
 * Path: /all
 * method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
usersRouter.get('/all', AccessTokenValidator, verifiedUserValidator, wrapAsync(getAllUsersController));

/**
 * Description: Search users by name
 * Path: /search
 * Method: GET
 * Query: { name: string, page?: number, limit?: number }
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/search', AccessTokenValidator, verifiedUserValidator, wrapAsync(searchUsersByNameController));


/**
 * @swagger
 * /users/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followed_user_id
 *             properties:
 *               followed_user_id:
 *                 type: string
 *                 description: ID of user to follow
 *     responses:
 *       200:
 *         description: Follow successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Follower success
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
/**
 * Description: follow someone
 * Path: /follow
 * method: post
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.post('/follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))

/**
 * @swagger
 * /users/un-follow:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followed_user_id
 *             properties:
 *               followed_user_id:
 *                 type: string
 *                 description: ID of user to unfollow
 *     responses:
 *       200:
 *         description: Unfollow successful
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
/**
 * Description: un follow someone
 * Path: /un_follow
 * method: delete
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.delete('/un-follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(unFollowController))

/**
 * @swagger
 * /users/followers:
 *   get:
 *     summary: Get list of followers for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get followers successful
 *                 result:
 *                   type: array
 *                  
 *       401:
 *         description: Unauthorized
 *     description: Uses the authenticated user's ID from the authorization token.
 */


usersRouter.get('/followers',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getFollowersController)
)

/**
 * @swagger
 * /users/following:
 *   get:
 *     summary: Get list of users being followed by the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved following list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get following successfully"
 *                 result:
 *                   type: array
 *                  
 *       401:
 *         description: Unauthorized (invalid/missing token)
 *       403:
 *         description: User not verified
 *     description: Uses user ID from authorization token to get following list
 */
/**
 * Description: get following
 * Path: /following
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/following', AccessTokenValidator, verifiedUserValidator, wrapAsync(getFollowingController))

/**
 * @swagger
 * /users/profile/{user_id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of user to get profile for
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get profile successful
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     avatar:
 *                       type: string
 */
/**
 * Description: get user profile by _id
 * Path: /profile/:user_id
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/profile/:user_id', AccessTokenValidator, verifiedUserValidator, wrapAsync(getProfileUserByIdController))

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *               cover_photo:
 *                 type: string
 *               location:
 *                 type: string
 *               website:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update profile successful
 *                 result:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     bio:
 *                       type: string
 *       401:
 *         description: Unauthorized
 */
/**
 * Description: Update my profile
 * Path: /me
 * method: PATCH
 * Header: {Authorization: Bearer <access_token>}
 * body: User Schema
 */
usersRouter.patch('/me', AccessTokenValidator, verifiedUserValidator, wrapAsync(updateMyProfileController))

export default usersRouter
