import { Router } from 'express'
import {
  createNewStoryController,
  getArchiveStoriesController,
  getNewsFeedStoriesController,
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


export default storiesRouter

 