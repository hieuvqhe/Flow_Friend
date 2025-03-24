import { Router } from 'express'
import {
  deleteAllMessageInConversationController,
  deleteMessageInConversationController,
  editMessageInConversationController,
  getAllConverSationsController,
  getConversationsByReceiverIdController,
  setEmojiMessageInConversationController
} from '~/controllers/conversation.controller'
import {
  deleteAllMessageInConversationValidator,
  deleteMessageValidator,
  editMessageValidator
} from '~/middlewares/conversations.middlewares'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const conversationsRouter = Router()

/**
 * @swagger
 * /conversations/receivers/{receiver_id}:
 *   get:
 *     summary: Get conversation messages with a specific user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receiver_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the user to get conversations with
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of messages per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved conversation messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get conversation successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     conversations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Message'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: |
 *           Invalid input:
 *           - Invalid receiver ID
 *           - Invalid pagination parameters
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

/**
 * Description: get receive
 * Path: /receivers/:receiver_id
 * Method: get
 * params: {limit: number, page: number}
 * header: {Authorization:Bearer <access_token> }
 */
conversationsRouter.get(
    '/receivers/:receiver_id',
    AccessTokenValidator,
    verifiedUserValidator,
    paginationValidator,
    getConversationsValidator,
    wrapAsync(getConversationsByReceiverIdController)
  )
  
/**
 * @swagger
 * /conversations/all_conversation:
 *   get:
 *     summary: Get all conversation threads for the authenticated user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *         description: Number of conversation threads per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: Search term to filter conversations by user name
 *                 example: "John"
 *     responses:
 *       200:
 *         description: Successfully retrieved conversation threads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get conversation successfully"
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConversationThread'
 *                 limit:
 *                   type: integer
 *                   example: 20
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 3
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

/**
 * Description:get all conversation
 * Path: /all_conversation
 * Method: GET
 * header: {Authorization:Bearer <access_token> }
 */
conversationsRouter.get(
    '/all_conversation',
    AccessTokenValidator,
    verifiedUserValidator,
    wrapAsync(getAllConverSationsController)
  )

/**
 * @swagger
 * /conversations/message/{messages_id}:
 *   put:
 *     summary: Edit a message in a conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messages_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the message to edit
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
 *                 example: "Updated message content"
 *     responses:
 *       200:
 *         description: Message edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Edit conversation successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     value:
 *                       $ref: '#/components/schemas/Message'
 *                     ok:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: |
 *           Invalid request:
 *           - Message ID is required
 *           - Content is required
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Message not found
 */

/**
 * Description: edit message in conversation
 * Path: /message/:messages_id
 * Method: PUT
 * header: {Authorization:Bearer <access_token> }
 * body: {content: string}
 */
conversationsRouter.put(
  '/message/:messages_id',
  AccessTokenValidator,
  verifiedUserValidator,
  editMessageValidator,
  wrapAsync(editMessageInConversationController)
)

/**
 * @swagger
 * /conversations/message/emoji/{messages_id}:
 *   post:
 *     summary: Set an emoji reaction on a message
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messages_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the message to add emoji to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - emoji
 *             properties:
 *               emoji:
 *                 type: integer
 *                 description: Emoji code to set on the message
 *                 example: 1
 *     responses:
 *       200:
 *         description: Emoji added to message successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Set emoji message in conversation successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     value:
 *                       $ref: '#/components/schemas/Message'
 *                     ok:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: |
 *           Invalid request:
 *           - Message ID is required
 *           - Invalid emoji format
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Message not found
 */

/**
 * Description: set emoji message in conversation
 * Path: /message/emoji/:messages_id
 * Method: post
 * header: {Authorization:Bearer <access_token> }
 */
conversationsRouter.post(
  '/message/emoji/:messages_id',
  AccessTokenValidator,
  verifiedUserValidator,
  deleteMessageValidator,
  wrapAsync(setEmojiMessageInConversationController)
)

/**
 * @swagger
 * /conversations/message/{messages_id}:
 *   delete:
 *     summary: Delete a specific message from a conversation
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messages_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete message in conversation successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                       example: true
 *                     deletedCount:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Message ID is required
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 *       404:
 *         description: Message not found
 */

/**
 * Description: delete message in conversation
 * Path: /message/:messages_id
 * Method: DELETE
 * header: {Authorization:Bearer <access_token> }
 */
conversationsRouter.delete(
  '/message/:messages_id',
  AccessTokenValidator,
  verifiedUserValidator,
  deleteMessageValidator,
  wrapAsync(deleteMessageInConversationController)
)

/**
 * @swagger
 * /conversations/message/{receive_id}:
 *   delete:
 *     summary: Delete all messages in a conversation with a specific user
 *     tags: [Conversations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: receive_id
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *         example: "6624d44a5b7d4c2d4c4c4c4c"
 *         description: ID of the user whose conversation to delete
 *     responses:
 *       200:
 *         description: All messages deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Delete all messages in conversation successfully"
 *                 result:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Receiver ID is required
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: Account not verified
 */

/**
 * Description: delete all message in conversation
 * Path: /message/:messages_id
 * Method: DELETE
 * header: {Authorization:Bearer <access_token> }
 */
conversationsRouter.delete(
  '/message/:receive_id',
  AccessTokenValidator,
  verifiedUserValidator,
  deleteAllMessageInConversationValidator,
  wrapAsync(deleteAllMessageInConversationController)
)

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         sender_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         receive_id:
 *           type: string
 *           example: "6624d44a5b7d4c2d4c4c4c4c"
 *         content:
 *           type: string
 *           example: "Hello, how are you?"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:05:00Z"
 *         emoji:
 *           type: integer
 *           example: 1
 *           description: Emoji reaction code (0 means no emoji)
 *
 *     ConversationThread:
 *       type: object
 *       properties:
 *         users_follower_info:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "6624d44a5b7d4c2d4c4c4c4c"
 *             name:
 *               type: string
 *               example: "John Doe"
 *             username:
 *               type: string
 *               example: "johndoe"
 *             avatar:
 *               type: string
 *               format: uri
 *               example: "https://example.com/avatar.jpg"
 *             cover_photo:
 *               type: string
 *               format: uri
 *               example: "https://example.com/cover.jpg"
 *             is_online:
 *               type: boolean
 *               example: true
 *             last_active:
 *               type: string
 *               format: date-time
 *               example: "2024-04-25T09:05:00Z"
 *         messageCount:
 *           type: integer
 *           example: 10
 *         lastMessage:
 *           type: string
 *           format: date-time
 *           example: "2024-04-25T09:05:00Z"
 */
export default conversationsRouter
