import { Router } from 'express'
import { createCommentController, deleteCommentController, editCommentController, getCommentTweetController } from '~/controllers/comment.controller'
import { createCommentValidator, paginationValidator, tweetIdValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

export const commentsRouter = Router()

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments for a tweet
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tweet_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the tweet to get comments for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of comments per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get comments successfully"
 *                 results:
 *                   type: object
 *                   properties:
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

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
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment on a tweet
 *     tags: [Comments]
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
 *               - commentContent
 *             properties:
 *               tweet_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               commentContent:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 280
 *                 example: "Great post!"
 *               commentLink:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CommentStatus'
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *                 result:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: |
 *           Invalid request parameters:
 *           - Comment must be a string
 *           - Comment length must be between 1 and 280
 *           - Comment link must be an array
 *       422:
 *         description: |
 *           Validation error:
 *           - Comment link must be an array of media object (url must be string, type must be 'image' or 'video')
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Tweet not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentStatus:
 *       type: object
 *       required:
 *         - url
 *         - type
 *       properties:
 *         url:
 *           type: string
 *           example: "http://example.com/image.jpg"
 *         type:
 *           type: string
 *           enum: [image, video]
 *           description: "Only 'image' and 'video' are supported types"
 *           example: "image"
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         tweet_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         commentContent:
 *           type: string
 *           example: "Great post!"
 *         commentLink:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CommentStatus'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T15:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T15:30:00Z"
 */
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
 * @swagger
 * /comments:
 *   put:
 *     summary: Edit an existing comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment_id
 *               - commentContent
 *               - tweet_id
 *             properties:
 *               comment_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               tweet_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               commentContent:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 280
 *                 example: "Updated comment content"
 *     responses:
 *       200:
 *         description: Comment edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment edited successfully"
 *       400:
 *         description: |
 *           Invalid request parameters:
 *           - Invalid comment ID
 *           - Invalid tweet ID
 *       401:
 *         description: |
 *           Unauthorized:
 *           - Invalid access token
 *           - Not the comment owner
 *       403:
 *         description: Account not verified
 *       404:
 *         description: |
 *           Resource not found:
 *           - Comment not found
 *           - Tweet not found
 */
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
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c"
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                       example: true
 *                     deletedCount:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: |
 *           Not Found:
 *           - Comment not found
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         tweet_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         user_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c"
 *         commentContent:
 *           type: string
 *           example: "This is a great post!"
 *         commentLink:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CommentStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *     CommentStatus:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: "link"
 *         value:
 *           type: string
 *           example: "https://example.com"
 */