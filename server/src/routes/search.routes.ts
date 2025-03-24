import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidator } from '~/middlewares/search.middlewares'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import { makeOptional } from '~/utils/makeOptional'

export const searchRouter = Router()

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search tweets or users
 *     description: Search for tweets or users based on various criteria
 *     tags:
 *       - Search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Search text to filter tweets or users
 *       - in: query
 *         name: media_type
 *         schema:
 *           type: string
 *           enum: [image, video]
 *         description: Media type filter
 *       - in: query
 *         name: people_follow
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: If true, returns only tweets from people the user follows
 *       - in: query
 *         name: search_users
 *         schema:
 *           type: boolean
 *         description: If true, searches for users instead of tweets
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for results
 *     responses:
 *       200:
 *         description: Search completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     tweets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           content:
 *                             type: string
 *                           user:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               avatar:
 *                                 type: string
 *                           medias:
 *                             type: array
 *                             items:
 *                               type: object
 *                           hashtags:
 *                             type: array
 *                             items:
 *                               type: object
 *                           mentions:
 *                             type: array
 *                             items:
 *                               type: object
 *                           likes:
 *                             type: integer
 *                           bookmarks:
 *                             type: integer
 *                           retweet_count:
 *                             type: integer
 *                           comment_count:
 *                             type: integer
 *                           quote_count:
 *                             type: integer
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           bio:
 *                             type: string
 *                           location:
 *                             type: string
 *                           website:
 *                             type: string
 *                           is_followed:
 *                             type: boolean
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                     total_pages:
 *                       type: integer
 *                     total_tweets:
 *                       type: integer
 *                     total_users:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     execution_time_ms:
 *                       type: integer
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 */
searchRouter.get('/', makeOptional(AccessTokenValidator), searchValidator, wrapAsync(searchController))
