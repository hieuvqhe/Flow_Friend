import { ObjectId } from 'bson'
import databaseService from './database.services'
import Comment, { CommentStatus } from '~/models/schemas/Comment.schema'

class CommentServices {
  async getAllCommentInTweet(tweet_id: string, limit: number, page: number) {
    const comments = await databaseService.comments
      .aggregate([
        {
          $match: { tweet_id: new ObjectId(tweet_id) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $project: {
            _id: 1,
            comment_id: 1,
            user_id: 1,
            commentContent: 1,
            commentLink: 1,
            createdAt: 1,
            updatedAt: 1,
            'user_info.username': 1,
            'user_info.avatar': 1
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.comments.countDocuments({ tweet_id: new ObjectId(tweet_id) })

    return { comments, total }
  }

  async createComment(tweet_id: string, user_id: string, commentContent: string, commentLink: CommentStatus[]) {
    const _id = new ObjectId()
    const comment = await databaseService.comments.insertOne(
      new Comment({
        _id,
        tweet_id: new ObjectId(tweet_id),
        user_id: new ObjectId(user_id),
        commentContent,
        commentLink
      })
    )
    return comment
  }

  
}

const commentServices = new CommentServices()
export default commentServices
