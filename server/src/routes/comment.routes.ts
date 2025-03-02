import { Router } from 'express'
import { createCommentController, getCommentTweetController } from '~/controllers/comment.controller'
import { createCommentValidator, paginationValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

export const commentsRouter = Router()

/**
 * Description: get comment
 * Path: /
 * method: get
 * Header: {Authorization: Bearer <access_token>}
 * body: {tweet_id: string}
 */
commentsRouter.get(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapAsync(getCommentTweetController)
)

/**
 * Description: create comment tweet
 * Path: /
 * method: post
 * Header: {Authorization: Bearer <access_token>}
 * body: {tweet_id: string, user_id: string, commentContent: string, commentLink: CommentStatus[]}
 */
commentsRouter.post(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  createCommentValidator,
  wrapAsync(createCommentController)
)