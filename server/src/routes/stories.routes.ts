import { Router } from 'express'
import {
  createNewStoryController,
  deleteStoryController,
  getArchiveStoriesController,
  getNewsFeedStoriesController,
  getStoryViewersController,
  reactStoryController,
  replyStoryController,
  updateStoryStoryController,
  viewAndStatusStoryController,
  
} from '~/controllers/stories.controllers'
import {
  createNewStoryValidator,
  reactStoryValidator,
  replyStoryValidator,
  updateStoryValidator,
  viewAndStatusStoryValidator
} from '~/middlewares/stories.middleware'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const storiesRouter = Router()

/**
 * @swagger
 * /stories/create-story:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "My first story"
 *               media_url:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/image.jpg"
 *               media_type:
 *                 type: string
 *                 example: "image/jpeg"
 *               caption:
 *                 type: string
 *                 example: "Beautiful day"
 *               privacy:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 example: ["6624d44a5b7d4c2d4c4c4c4c"]
 *     responses:
 *       200:
 *         description: Story created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Create story successfully"
 *                 result:
 *                   $ref: '#/components/schemas/Story'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */
storiesRouter.post(
    '/create-story',
    AccessTokenValidator,
    verifiedUserValidator,
    createNewStoryValidator,
    wrapAsync(createNewStoryController)
)

/**
 * @swagger
 * /stories/view-and-status-story:
 *   post:
 *     summary: View and update status of a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - story_id
 *               - view_status
 *               - content
 *             properties:
 *               story_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               view_status:
 *                 type: string
 *                 example: "seen"
 *               content:
 *                 type: string
 *                 example: "Story content"
 *     responses:
 *       200:
 *         description: Story view status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "View and status story successfully"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       viewer_id:
 *                         type: array
 *                         items:
 *                           type: string
 *                       seen_at:
 *                         type: string
 *                         format: date-time
 *                       content:
 *                         type: string
 *                       view_status:
 *                         type: string
 *       400:
 *         description: Invalid request or cannot view your own story
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Story not found
 */
storiesRouter.post(
    '/view-and-status-story',
    AccessTokenValidator,
    verifiedUserValidator,
    viewAndStatusStoryValidator,
    wrapAsync(viewAndStatusStoryController)
)

/**
 * @swagger
 * /stories/update-story:
 *   post:
 *     summary: Update an existing story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - story_id
 *             properties:
 *               story_id:
 *                 type: string
 *                 format: ObjectId
 *                 example: "6624d44a5b7d4c2d4c4c4c4c"
 *               content:
 *                 type: string
 *                 example: "Updated story content"
 *               caption:
 *                 type: string
 *                 example: "Updated caption"
 *               media_url:
 *                 type: string
 *                 example: "https://example.com/updated_image.jpg"
 *               media_type:
 *                 type: string
 *                 example: "image/jpeg"
 *               privacy:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6624d44a5b7d4c2d4c4c4c"]
 *     responses:
 *       200:
 *         description: Story updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Update story successfully"
 *                 result:
 *                   $ref: '#/components/schemas/Story'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Story not found
 */
storiesRouter.post(
  '/update-story',
  AccessTokenValidator,
  verifiedUserValidator,
  updateStoryValidator,
  wrapAsync(updateStoryStoryController)
)

/**
 * @swagger
 * /stories/get-news-feed-stories:
 *   get:
 *     summary: Get stories for news feed
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of stories to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of news feed stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get news feed stories successfully"
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */
storiesRouter.get(
  '/get-news-feed-stories',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getNewsFeedStoriesController)
)

/**
 * @swagger
 * /stories/get-archive-stories:
 *   get:
 *     summary: Get archived stories
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Number of stories to return per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of archived stories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get archive stories successfully"
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Story'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */
storiesRouter.get(
  '/get-archive-stories',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getArchiveStoriesController)
)

/**
 * @swagger
 * /stories/delete-story/{story_id}:
 *   delete:
 *     summary: Delete a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: story_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the story to delete
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete story successfully"
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
 *         description: Story not found or not owned by user
 */
storiesRouter.delete(
  '/delete-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(deleteStoryController)
)

/**
 * @swagger
 * /stories/get-story-viewers/{story_id}:
 *   get:
 *     summary: Get viewers of a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: story_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the story to get viewers for
 *     responses:
 *       200:
 *         description: List of story viewers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get story viewers successfully"
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       viewer_id:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: ObjectId
 *                       seen_at:
 *                         type: string
 *                         format: date-time
 *                       content:
 *                         type: string
 *                       view_status:
 *                         type: string
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Story not found
 */
storiesRouter.get(
  '/get-story-viewers/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getStoryViewersController)
)

/**
 * @swagger
 * /stories/react-story/{story_id}:
 *   post:
 *     summary: React to a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: story_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the story to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reaction
 *             properties:
 *               reaction:
 *                 type: string
 *                 example: "❤️"
 *     responses:
 *       200:
 *         description: React to story successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "React story successfully"
 *                 result:
 *                   $ref: '#/components/schemas/Story'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Story not found
 */
storiesRouter.post(
  '/react-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  reactStoryValidator,
  wrapAsync(reactStoryController)
)

/**
 * @swagger
 * /stories/reply-story/{story_id}:
 *   post:
 *     summary: Reply to a story
 *     tags: [Stories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: story_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the story to reply to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Great story!"
 *     responses:
 *       200:
 *         description: Reply to story successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reply story successfully"
 *                 result:
 *                   $ref: '#/components/schemas/Story'
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Story not found
 */
storiesRouter.post(
  '/reply-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  replyStoryValidator,
  wrapAsync(replyStoryController)
)

/**
 * @swagger
 * components:
 *   schemas:
 *     Story:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         user_id:
 *           type: string
 *           format: ObjectId
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "This is my story content"
 *         media_url:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         media_type:
 *           type: string
 *           example: "image/jpeg"
 *         caption:
 *           type: string
 *           example: "Beautiful day"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *         expires_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-26T09:00:00Z"
 *         viewer:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               viewer_id:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *               seen_at:
 *                 type: string
 *                 format: date-time
 *               content:
 *                 type: string
 *               view_status:
 *                 type: string
 *         privacy:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         is_active:
 *           type: boolean
 *         reactions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: ObjectId
 *               reaction:
 *                 type: string
 *         replies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: ObjectId
 *               content:
 *                 type: string
 *               created_at:
 *                 type: string
 *                 format: date-time
 */

export default storiesRouter

