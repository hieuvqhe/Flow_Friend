import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { COMMENT_MESSAGES } from '~/constants/messages'
import { getCommentTweetReqBody } from '~/models/request/Comment.request'
import commentServices from '~/services/comment.service'

export const getCommentTweetController = async (
    req: Request<ParamsDictionary, any, getCommentTweetReqBody>,
    res: Response
  ) => {
    const { tweet_id, limit, page } = req.query
  
    const { comments, total } = await commentServices.getAllCommentInTweet(
      tweet_id as string,
      Number(limit),
      Number(page)
    )
    res.json({
      message: COMMENT_MESSAGES.GET_COMMENT_SUCCESS,
      results: {
        comments,
        page: Number(page),
        total_pages: Math.round(total / Number(limit))
      }
    })
  }
export const createCommentController = async (
  req: Request<ParamsDictionary, any, getCommentTweetReqBody>,
  res: Response
) => {
    
}
