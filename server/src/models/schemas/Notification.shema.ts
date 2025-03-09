import { ObjectId } from 'mongodb'

interface NotificationType {
  _id?: ObjectId
  userId: ObjectId
  senderId: ObjectId
  actionType: string
  targetId: string[]
  content: string
  timestamp: Date
  status: string
}

export class Notification {
  _id?: ObjectId
  userId: ObjectId
  senderId: ObjectId
  actionType: string
  targetId: string[]
  content: string
  timestamp?: Date
  status: string

  constructor({ _id, userId, senderId, actionType, targetId, content, timestamp, status }: NotificationType) {
    this._id = _id
    this.userId = userId
    this.senderId = senderId
    this.actionType = actionType
    this.targetId = targetId
    this.content = content
    this.timestamp = timestamp
    this.status = status
  }
}
