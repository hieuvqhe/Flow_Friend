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
  tweetIdValidator,

} from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

export const tweetsRouter = Router()

/**
 * @swagger
 * /tweets:
 *   post:
 *     summary: Create a new tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - audience
 *             properties:
 *               type:
 *                 type: integer
 *                 enum: [0, 1, 2, 3]
 *                 description: |
 *                   Tweet type:
 *                   - 0: Tweet
 *                   - 1: Retweet  
 *                   - 2: Comment
 *                   - 3: QuoteTweet
 *               audience:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: |
 *                   Audience scope:
 *                   - 0: Public
 *                   - 1: Circle
 *               content:
 *                 type: string
 *                 example: "Hello Twitter!"
 *               parent_id:
 *                 type: string
 *                 description: Required for Retweet/Comment/QuoteTweet
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "tech"
 *               mentions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                   example: "6624d44a5b7d4c2d4c4c4c4c"
 *               medias:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Media'
 *     responses:
 *       201:
 *         description: Tweet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tweet created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Tweet'
 *       400:
 *         description: |
 *           Invalid input:
 *           - Invalid tweet type
 *           - Content required for this tweet type
 *           - Invalid media format
 *           - Invalid parent tweet
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Account not verified
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Media:
 *       type: object
 *       properties:
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           description: |
 *             Media type:
 *             - 0: Image
 *             - 1: Video
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/image.jpg"
 * 
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: integer
 *         audience:
 *           type: integer
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         created_at:
 *           type: string
 *           format: date-time
 */

// Cập nhật lại route nếu cần thay đổi status code
tweetsRouter.post(
  '/',
  AccessTokenValidator,
  verifiedUserValidator, 
  createTweetValidator,
  wrapAsync(createTweetController)
)
/**
 * Description: get All Tweet
 * Path: /
 * Method: GET
 * Body: user_id: string
 *  * Header: {Authorization: Bearer <access_token>}
 * type: tweetTypes
 */
/**
 * @swagger
 * /tweets:
 *   get:
 *     summary: Get all tweets for authenticated user
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved tweets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get tweets successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TweetResponse'
 *       401:
 *         description: Unauthorized (invalid/missing token)
 *       403:
 *         description: Account not verified
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TweetResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "Hello Twitter!"
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *             example: "6624d44a5b7d4c2d4c4c4c4c"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *             example: "tech"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-20T10:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-20T10:05:00Z"
 *         guest_views:
 *           type: number
 *           example: 1000
 *         user_views:
 *           type: number
 *           example: 500
 *         audience:
 *           type: integer
 *           enum: [0, 1]
 *           example: 0
 *         mention_info:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *         hashtag_info:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "technology"
 *
 *     Media:
 *       type: object
 *       properties:
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           example: 0
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/image.jpg"
 */

tweetsRouter.get('/', AccessTokenValidator, verifiedUserValidator, wrapAsync(getAllTweetController))
/**
 * Description: get Tweet details
 * Path: /
 * Method: GET
 * Body: user_id: string
 *  * Header: {Authorization: Bearer <access_token>}
 * type: tweetTypes
 */
/**
 * @swagger
 * /tweets/{tweet_id}:
 *   get:
 *     summary: Get tweet details
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *     responses:
 *       200:
 *         description: Successfully retrieved tweet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get tweet details successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TweetDetails'
 *       401:
 *         description: |
 *           Unauthorized:
 *           - Access token is required
 *           - Invalid access token
 *       403:
 *         description: |
 *           Forbidden:
 *           - Tweet is not public
 *           - Account not verified
 *       404:
 *         description: |
 *           Not Found:
 *           - Tweet not found
 *           - User not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TweetDetails:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "Hello Twitter World!"
 *         audience:
 *           type: integer
 *           enum: [0, 1]
 *           example: 0
 *         guest_views:
 *           type: number
 *           example: 1500
 *         user_views:
 *           type: number
 *           example: 300
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-22T08:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-22T08:05:00Z"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *             example: "tech"
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *             example: "6624d44a5b7d4c2d4c4c4c4c"
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         mention_info:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *         hashtag_info:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "technology"
 * 
 *     Media:
 *       type: object
 *       properties:
 *         type:
 *           type: integer
 *           enum: [0, 1]
 *           example: 0
 *         url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/tweet-image.jpg"
 */

tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(audienceValidator),
  wrapAsync(getTweetDetailsController)
)

/**
 * Description: get Tweet Children
 * Path: /:tweet_id/children
 * Method: GET
 * Body: user_id: string
 * type: tweetTypes
 *  * Header: {Authorization: Bearer <access_token>}
 * Query: {limit: number,page:number,tweet_type: TweetType}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(audienceValidator),
  wrapAsync(getTweetChildrenController)
)

/**
 * Description: get new feeds
 * Path: /new-feeds
 * Method: GET
 * Body: user_id: string
 * type: tweetTypes
 * Header: {Authorization: Bearer <access_token>}
 * Query: {limit: number,page:number,tweet_type: TweetType}
 */
/**
 * @swagger
 * /tweets/new/new-feeds:
 *   get:
 *     summary: Get new feeds for authenticated user
 *     tags: [Feeds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved new feeds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get new feeds successfully"
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tweet'
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 total_pages:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: |
 *           Invalid input:
 *           - Limit must be between 1-100
 *           - Page must be >= 1
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "Check out this new feature!"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *             example: "technews"
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 */
tweetsRouter.get(
  '/new/new-feeds',
  AccessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapAsync(getNewTweetController)
)

/**
 * Description: edit tweet
 * Path: /edit
 * Method: PUT
 * Body: _id: string, content: string, hashtags: string[], medias: Media[], mentions: string[], audience: TweetAudience
 * Header: {Authorization: Bearer <access_token>}
 */
/**
 * @swagger
 * /tweets/edit:
 *   put:
 *     summary: Edit an existing tweet
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - content
 *             properties:
 *               _id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 example: "Updated tweet content"
 *               hashtags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["coding", "javascript"]
 *               medias:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Media'
 *               mentions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 example: ["6624d44a5b7d4c2d4c4c4c4d"]
 *               audience:
 *                 $ref: '#/components/schemas/TweetAudience'
 *     responses:
 *       200:
 *         description: Tweet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tweet edited successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Tweet'
 *       400:
 *         description: |
 *           Invalid input:
 *           - Content must be a non-empty string
 *           - Invalid tweet ID format
 *       401:
 *         description: |
 *           Unauthorized:
 *           - Invalid access token
 *           - Not the tweet owner
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Tweet not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "New updated content"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         hashtags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *           example: [{ "_id": "6624d44a5b7d4c2d4c4c4c4e", "name": "coding" }]
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         mentions:
 *           type: array
 *           items:
 *             type: string
 *           example: ["6624d44a5b7d4c2d4c4c4c4d"]
 *         audience:
 *           $ref: '#/components/schemas/TweetAudience'
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T15:30:00Z"
 *     Media:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           example: "http://example.com/image.jpg"
 *         type:
 *           type: string
 *           enum: [image, video]
 *           example: "image"
 *     TweetAudience:
 *       type: string
 *       enum: [Everyone, TwitterCircle]
 *       example: "Everyone"
 */
tweetsRouter.put(
  '/edit',
  AccessTokenValidator,
  verifiedUserValidator,
  editTweetValidator,
  wrapAsync(editTweetController)
)

/**
 * Description: delete tweet
 * Path: /:tweet_id
 * Method: PUT
 * Header: {Authorization: Bearer <access_token>}
 */
/**
 * @swagger
 * /tweets/{tweet_id}:
 *   delete:
 *     summary: Delete a tweet and its associated data
 *     tags: [Tweets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the tweet to delete
 *     responses:
 *       200:
 *         description: Successfully deleted tweet and all related data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tweet deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Tweet'
 *       400:
 *         description: Invalid tweet ID format
 *       401:
 *         description: |
 *           Unauthorized:
 *           - Invalid access token
 *           - Not the tweet owner
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Tweet not found
 *     description: |
 *       Deletes tweet along with all related:
 *       - Likes
 *       - Bookmarks
 *       - Comments
 *       - Media files from S3 (both images and HLS video folders)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tweet:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "Deleted tweet content"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         medias:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Media'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *         # Add other tweet properties as needed
 */

tweetsRouter.delete(
  '/:tweet_id',
  AccessTokenValidator,
  verifiedUserValidator,
  deleteTweetValidator,
  wrapAsync(deleteTweetController)
)
