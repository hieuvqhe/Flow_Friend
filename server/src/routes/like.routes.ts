import { Router } from 'express'
import { getLikeTweetController, likeTweetController, unLikeTweetController } from '~/controllers/likes.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
export const likesTweetRouter = Router()

/**
 * Description: Like Tweet
 * Path: /
 * Method: POST
 * Body: {tweet_id: string}
 * header: {Authorization:Bearer <access_token> }
 */
likesTweetRouter.post(
  '/',
  AccessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(likeTweetController)
)