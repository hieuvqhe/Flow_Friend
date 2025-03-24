import { Router } from 'express'
import { chatWithGeminiController, generateTweetTextGeminiController } from '~/controllers/tweet.controllers'
import { messageUploadValidator } from '~/middlewares/conversations.middlewares'
import { AccessTokenValidator, premiumUserValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const tweetGeminiRoutes = Router()

/**
 * @swagger
 * /geminiTweet/generate/text:
 *   post:
 *     summary: Generate tweet content using Gemini AI
 *     tags: [Gemini]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Generate a tweet about climate change"
 *     responses:
 *       200:
 *         description: Tweet content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Generate tweet with Gemini successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: "Climate change isn't waiting for us to believe in it. It's happening now. Let's take action today for a livable tomorrow. #ClimateAction #SustainableFuture"
 *                     hashtags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["ClimateAction", "SustainableFuture"]
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: |
 *           Access denied:
 *           - Account not verified
 *           - Premium access required
 */
/**
 * Description: generate tweet with gemini (text)
 * Path: /generate/text
 * Method: POST
 * header: {Authorization:Bearer <access_token> }
 * body: message
 */
tweetGeminiRoutes.post(
  '/generate/text',
  AccessTokenValidator,
  verifiedUserValidator,
  premiumUserValidator,
  messageUploadValidator,
  wrapAsync(generateTweetTextGeminiController)
)

/**
 * @swagger
 * /geminiTweet/generate/chat:
 *   post:
 *     summary: Chat with Gemini AI
 *     tags: [Gemini]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Tell me about the benefits of social media"
 *     responses:
 *       200:
 *         description: Chat response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat with Gemini successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: "Social media offers numerous benefits including global connectivity, real-time information sharing, community building, and business growth opportunities. It allows people to maintain relationships regardless of distance, access diverse perspectives, and participate in movements for social change. For businesses, it provides cost-effective marketing, customer engagement, and analytics. However, it's important to balance these benefits with awareness of potential drawbacks like privacy concerns and screen time management."
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: |
 *           Access denied:
 *           - Account not verified
 *           - Premium access required
 */
//  * Description: chat with gemini (text)
//  * Path: /generate/chat
//  * Method: POST
//  * body: {message: string}
//  * header: {Authorization:Bearer <access_token> }
tweetGeminiRoutes.post(
  '/generate/chat',
  AccessTokenValidator,
  verifiedUserValidator,
  premiumUserValidator,
  messageUploadValidator,
  wrapAsync(chatWithGeminiController)
)

/**
 * @swagger
 * /geminiTweet/generate/image:
 *   post:
 *     summary: Generate tweet content from an image using Gemini AI
 *     tags: [Gemini]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to analyze
 *               message:
 *                 type: string
 *                 description: Optional message to provide context for the image
 *                 example: "Generate a tweet about this image"
 *     responses:
 *       200:
 *         description: Tweet content generated successfully from image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chat with Gemini successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: "Breathtaking sunset over the mountains today! Nature's artwork at its finest. #SunsetViews #NaturePhotography #MountainScapes"
 *       400:
 *         description: Invalid input data or unsupported image format
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       403:
 *         description: |
 *           Access denied:
 *           - Account not verified
 *           - Premium access required
 *       413:
 *         description: Image file size too large
 */
//  * Description: gen tweet with gemini (image)
//  * Path: /generate/gen-image
//  * Method: POST
//  * body: form-data {image: file}
//  * header: {Authorization:Bearer <access_token> }
tweetGeminiRoutes.post(
  '/generate/image',
  AccessTokenValidator,
  verifiedUserValidator,
  premiumUserValidator,
  messageUploadValidator,
  wrapAsync(chatWithGeminiController)
)

/**
 * @swagger
 * components:
 *   schemas:
 *     GeminiResponse:
 *       type: object
 *       properties:
 *         content:
 *           type: string
 *           example: "Just witnessed the most amazing sunset at the beach! The colors were absolutely breathtaking. Nature's artwork at its finest. #SunsetViews #BeachLife #NatureLovers"
 *         hashtags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["SunsetViews", "BeachLife", "NatureLovers"]
 */
export default tweetGeminiRoutes
