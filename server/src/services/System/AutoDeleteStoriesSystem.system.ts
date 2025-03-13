import Stories from '~/models/schemas/Stories.schema'
import databaseService from '../database.services'
import { ObjectId } from 'mongodb'

class CDNCacheExpirySystem {
  private checkInterval: NodeJS.Timeout | null

  constructor() {
    this.checkInterval = null
  }

  initialize() {
    this.startExpiryCheck()
    console.log('CDN Cache Expiry System initialized')
  }

  private startExpiryCheck() {
    this.checkInterval = setInterval(async () => {
      await this.handleExpiredStories()
    }, 60 * 1000) 
  }

  private async handleExpiredStories() {
    try {
      const now = new Date()

      const expiredStories = await databaseService.stories
        .find({
          expires_at: { $lte: now },
          is_active: true
        })
        .toArray()

      if (!expiredStories.length) {
        return
      }

      const expiredStoryIds = expiredStories
        .map((story: Stories) => story._id)
        .filter((id): id is ObjectId => id !== undefined)

      const result = await databaseService.stories.updateMany(
        {
          _id: { $in: expiredStoryIds }
        },
        {
          $set: { 
            is_active: false,
            cache_version: Date.now()
          }
        }
      )

      console.log(`Đã cập nhật ${result.modifiedCount} stories hết hạn trong CDN cache`)
    } catch (error) {
      console.error('Lỗi trong handleExpiredStories:', error)
    }
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }
}

const cdnCacheExpirySystem = new CDNCacheExpirySystem()
export default cdnCacheExpirySystem