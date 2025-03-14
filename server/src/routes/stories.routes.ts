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

storiesRouter.post(
    '/create-story',
    AccessTokenValidator,
    verifiedUserValidator,
    createNewStoryValidator,
    wrapAsync(createNewStoryController)
)

storiesRouter.post(
    '/view-and-status-story',
    AccessTokenValidator,
    verifiedUserValidator,
    viewAndStatusStoryValidator,
    wrapAsync(viewAndStatusStoryController)
)

storiesRouter.post(
  '/update-story',
  AccessTokenValidator,
  verifiedUserValidator,
  updateStoryValidator,
  wrapAsync(updateStoryStoryController)
)

storiesRouter.get(
  '/get-news-feed-stories',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getNewsFeedStoriesController)
)

storiesRouter.get(
  '/get-archive-stories',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getArchiveStoriesController)
)

storiesRouter.delete(
  '/delete-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(deleteStoryController)
)

storiesRouter.get(
  '/get-story-viewers/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getStoryViewersController)
)

storiesRouter.post(
  '/react-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  reactStoryValidator,
  wrapAsync(reactStoryController)
)

storiesRouter.post(
  '/reply-story/:story_id',
  AccessTokenValidator,
  verifiedUserValidator,
  replyStoryValidator,
  wrapAsync(replyStoryController)
)

export default storiesRouter

 