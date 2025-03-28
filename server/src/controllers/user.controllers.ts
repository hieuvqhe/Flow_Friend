import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import {
  FollowReqBody,
  TokenPayload,
  RefreshTokenReqBody,
  VerifyEmailReqBody,
  ForgotPasswordReqBody,
  VerifyForgotPasswordReqBody,
  ResetPasswordReqBody,
  UpdateMeReqBody
} from "../models/request/User.request";
import { config } from "dotenv";
import { envConfig } from "../constants/config";
import User from '~/models/schemas/User.schema'
import usersService from "../services/users.services";
import databaseService from '~/services/database.services'
import { USERS_MESSAGES } from "../constants/messages";
import HTTP_STATUS from '~/constants/httpStatus'
import { WithId } from 'mongodb'
import { ObjectId } from 'bson'
import { UserVerifyStatus } from '~/constants/enums'
import { LoginReqBody, RegisterReqBody, LogoutReqBody } from "../models/request/User.request";
import { pick } from "lodash";

config();

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  console.log(`User logged in with user_id: ${user_id.toString()}`)
  const result = await usersService.login({ user_id: user_id.toString(), verify: UserVerifyStatus.Verified })
  res.status(200).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)

  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const oauthController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlRedirect = `${envConfig.client_redirect}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify=${result.verify}`
  res.redirect(urlRedirect)
  res.status(200).json({
    message: result.newUser ? USERS_MESSAGES.REGISTER_SUCCESS : USERS_MESSAGES.LOGIN_SUCCESS,
    result: {
      access_token: result.access_token,
      refresh_token: result.refresh_token
    }
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body

  const result = await usersService.logout(refresh_token as string)

  res.json(result)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { user_id, verify } = req.decoded_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await usersService.refreshToken(user_id, verify, refresh_token)
  res.json({
    message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result: result
  })
}
export const emailVerifyController = async (req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  // đã verify rồi thì sẽ ko báo lỗi => return 200 luôn + msg: verify trước đó rồi
  if ((user as WithId<User>).email_verify_token === '') {
    res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersService.verifyEmail(user_id)
  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user?.verify === UserVerifyStatus.Verified) {
    res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  const result = await usersService.resendVerifyEmail(user_id)
  res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  const user = await databaseService.users.findOne({ _id: new ObjectId(_id) })

  if (!user) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  const result = await usersService.forgotPassword({
    user_id: new ObjectId(_id).toString(),
    verify: verify
  })
  res.json(result)
}
export const VerifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decode_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(new ObjectId(user_id).toString(), password)
  res.json({ message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS, result })
}

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await usersService.getAllUsers(page, limit);
    res.json({
      message: 'Fetched users successfully',
      result: {
        users: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const searchUsersByNameController = async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!name) {
      res.status(400).json({
        message: 'Name query parameter is required',
      });
      return;
    }

    const result = await usersService.searchUsersByName(name, page, limit);
    res.json({
      message: 'Searched users successfully',
      result: {
        users: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      message: 'Failed to search users',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.follow(user_id, followed_user_id)
  res.json(result)
}

export const unFollowController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.unFollow(user_id, followed_user_id)
  res.json(result)
}

export const getFollowingController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await usersService.getFollowing(user_id)
  res.json({
    message: USERS_MESSAGES.GET_FOLLOWING_SUCCESSFULLY,
    result: result
  })
}

export const getFollowersController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload
  const result = await usersService.getFollowers(user_id)
  res.json({
    message: USERS_MESSAGES.GET_FOLLOWERS_SUCCESSFULLY,
    result: result
  })
}

export const getProfileUserByIdController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.params
  const result = await usersService.getUserProfileById(user_id)
  debugger
  console.log(user_id);
  res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: result
  })
}

export const updateMyProfileController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decode_authorization as TokenPayload

  const body = pick(req.body, [
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]) as UpdateMeReqBody

  const user = await usersService.updateMyProfile(user_id, body)
  res.json({
    message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS,
    result: user
  })
}