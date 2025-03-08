import { Router } from 'express'
import { createCommentController, deleteCommentController, editCommentController, getCommentTweetController } from '~/controllers/comment.controller'
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

/**
 * Description: edit comment tweet
 * Path: /
 * method: put
 * Header: {Authorization: Bearer <access_token>}
 * body: {comment_id: string, user_id: string, new_commentContent: string}
 */
commentsRouter.put(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(editCommentController)
)

/**
 * Description: delete comment tweet
 * Path: /
 * method: delete
 * params: {comment_id: string}
 * Header: {Authorization:Bearer <access_token> }
 */
commentsRouter.delete(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(deleteCommentController)
)