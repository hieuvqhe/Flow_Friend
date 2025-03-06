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
  