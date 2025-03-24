import { Router } from "express";
import {
    bookmarkTweetController,
    getBookmarkTweetController,
    unBookmarkTweetController
} from '~/controllers/bookmarks.controllers';
import { tweetIdValidator } from "~/middlewares/tweets.middlewares";
import { AccessTokenValidator, verifiedUserValidator } from "~/middlewares/users.middlewares";
import { wrapAsync } from "~/utils/handler";

const bookmarksRouter = Router();

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: Bookmark a tweet
 *     tags: [Bookmarks]
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
 *         description: Tweet bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookmark tweet successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "6624d44a5b7d4c2d4c4c4c"
 *       400:
 *         description: |
 *           Invalid request:
 *           - Invalid tweet ID format
 *           - Tweet already bookmarked
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Tweet not found
 */

/**
 * Description: Bookmark Tweet
 * Path: /
 * Method: POST
 * Body: {tweet_id: string}
 * header: {Authorization:Bearer <access_token> }
 */
bookmarksRouter.post(
    '/',
    AccessTokenValidator,
    verifiedUserValidator,
    tweetIdValidator,
    wrapAsync(bookmarkTweetController)
)

/**
 * @swagger
 * /bookmarks/{tweet_id}:
 *   delete:
 *     summary: Remove bookmark from a tweet
 *     tags: [Bookmarks]
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
 *         description: ID of the tweet to remove bookmark from
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unbookmark tweet successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                       example: true
 *                     deletedCount:
 *                       type: integer
 *                       example: 1
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
 *           - Bookmark not found for this tweet
 */

/**
 * Description:Un Bookmark Tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Body: {tweet_id: string}
 * header: {Authorization:Bearer <access_token> }
 */
bookmarksRouter.delete(
    '/:tweet_id',
    AccessTokenValidator,
    verifiedUserValidator,
    tweetIdValidator,
    wrapAsync(unBookmarkTweetController)
)

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get all bookmarks for the authenticated user
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get bookmarks in your account successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         tweet_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 */

/**
 * Description: Bookmark Tweet
 * Path: /
 * Method: GET
 * Body: {users_id: string}
 * header: {Authorization:Bearer <access_token> }
 *
 */
bookmarksRouter.get('/', AccessTokenValidator, verifiedUserValidator, wrapAsync(getBookmarkTweetController))
export default bookmarksRouter