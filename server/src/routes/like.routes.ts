import { Router } from 'express'
import { getLikeTweetController, likeTweetController, unLikeTweetController } from '~/controllers/like.controllers'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
export const likesTweetRouter = Router()

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Like a tweet
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tweet_id
 *             properties:
 *               tweet_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c"
 *     responses:
 *       200:
 *         description: Tweet liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Like tweet successfully"
 *                     result:
 *                       type: object
 *                       properties:
 *                         acknowledged:
 *                           type: boolean
 *                           example: true
 *                         insertedId:
 *                           type: string
 *                           example: "6624d44a5b7d4c2d4c4c4c"
 *       400:
 *         description: |
 *           Invalid request:
 *           - Invalid tweet ID format
 *           - Tweet already liked
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Tweet not found
 */

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

/**
 * @swagger
 * /likes/{tweet_id}:
 *   delete:
 *     summary: Unlike a tweet
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c"
 *         description: ID of the tweet to unlike
 *     responses:
 *       200:
 *         description: Tweet unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Unlike tweet successfully"
 *                     result:
 *                       type: object
 *                       properties:
 *                         acknowledged:
 *                           type: boolean
 *                           example: true
 *                         deletedCount:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: Invalid tweet ID format
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: |
 *           Not Found:
 *           - Tweet not found
 *           - Tweet already unliked
 */

/**
 * Description:Unlike Tweet
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Body: {tweet_id: string}
 * header: {Authorization:Bearer <access_token> }
 */
likesTweetRouter.delete(
  '/:tweet_id',
  AccessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapAsync(unLikeTweetController)
)

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         tweet_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 */
