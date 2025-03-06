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
} from '~/middlewares/conversation.middlewares'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { AccessTokenValidator, getConversationsValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const conversationsRouter = Router()
