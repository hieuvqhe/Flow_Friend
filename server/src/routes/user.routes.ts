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
  updateMyProfileController

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
  emailVerifyTokenValidator ,
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


usersRouter.post('/register', registerValidator, wrapAsync(registerController))
usersRouter.post('/logout', AccessTokenValidator, RefreshTokenValidator, wrapAsync(logoutController))


/**
 * Description: refresh token
 * Path: /refresh-token
 * method: POST
 * Header: {refresh_token: string}
 */
usersRouter.post('/refresh-token', RefreshTokenValidator, wrapAsync(refreshTokenController))

usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
usersRouter.post('/resend-verify-email', AccessTokenValidator, wrapAsync(resendVerifyEmailController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(VerifyForgotPasswordController)
)

usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

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
 * Description: un follow someone
 * Path: /un_follow
 * method: delete
 * body: {user_id: string}
 * Header: {followed_user_id: string}
 */
usersRouter.delete('/un-follow', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(unFollowController))


/**
 * Description: get followers
 * Path: /followers
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/followers', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(getFollowersController))

/**
 * Description: get following
 * Path: /following
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/following', AccessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(getFollowingController))

/**
 * Description: get user profile by _id
 * Path: /profile/:user_id
 * method: get
 * body: {user_id: string}
 */
usersRouter.get('/profile/:user_id', AccessTokenValidator, verifiedUserValidator, wrapAsync(getProfileUserByIdController))

/**
 * Description: Update my profile
 * Path: /me
 * method: PATCH
 * Header: {Authorization: Bearer <access_token>}
 * body: User Schema
 */
usersRouter.patch('/me', AccessTokenValidator, verifiedUserValidator, wrapAsync(updateMyProfileController))

export default usersRouter
