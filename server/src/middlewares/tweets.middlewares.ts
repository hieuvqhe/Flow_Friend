import { options } from 'axios'
import { checkSchema } from 'express-validator'
import { isLength } from 'lodash'
import { MediaType, TweetType } from '~/constants/enums'
import { COMMENT_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

const tweetTypes = numberEnumToArray(TweetType)
const mediaTypes = numberEnumToArray(MediaType)

export const createCommentValidator = validate(
  checkSchema({
    commentContent: {
      isString: {
        errorMessage: COMMENT_MESSAGES.COMMENT_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 280
        },
        errorMessage: COMMENT_MESSAGES.COMMENT_LENGTH_MUST_BE_BETWEEN_1_AND_280
      }
    },
    commentLink: {
      isArray: {
        errorMessage: COMMENT_MESSAGES.COMMENT_LINK_MUST_BE_AN_ARRAY
      },
      custom: {
        options: (value) => {
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(COMMENT_MESSAGES.COMMENT_LINK_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    }
  })
)
