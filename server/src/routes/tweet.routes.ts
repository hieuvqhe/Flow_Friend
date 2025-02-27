import { Router } from 'express'
import {
  createTweetController,
  deleteTweetController,
  editTweetController,
  getAllTweetController,
  getNewTweetController,
  getTweetChildrenController,
  getTweetDetailsController
} from '~/controllers/tweet.controllers'
import {
  audienceValidator,
  createTweetValidator,
  deleteTweetValidator,
  editTweetValidator,
  getTweetChildrenValidator,
  paginationValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

export const tweetsRouter = Router()

/**
 * Description: Create Tweet
 * Path: /
 * Method: POST
 *  * Header: {Authorization: Bearer <access_token>}
 * Body: TweetRequestBody
 */
tweetsRouter.post(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapAsync(createTweetController)
)