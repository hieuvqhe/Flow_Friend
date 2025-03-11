import { ObjectId } from 'bson'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { STORIES_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { createNewStoryResBody, viewAndStatusStoryResBody } from '~/models/request/Stories.requests'
import { TokenPayload } from '~/models/request/User.request'
import databaseService from '~/services/database.services'
import storiesService from '~/services/stories.services'

export const createNewStoryController = async (
    req: Request<ParamsDictionary, any, createNewStoryResBody, any>,
    res: Response
  ) => {
    const { user_id } = req.decode_authorization as TokenPayload
    const result = await storiesService.createNewStory({ payload: req.body, user_id })
    res.json({
      message: "successsuccess",
      result
    })
  }