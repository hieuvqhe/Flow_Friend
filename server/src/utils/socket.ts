import { Server, Socket } from 'socket.io'
import { ObjectId } from 'mongodb'
import { Server as ServerHttp } from 'http'

interface UserStatus {
  socket_id: string
  is_online: boolean
  last_active: Date
  timeoutId?: NodeJS.Timeout
  heartbeatTimeout?: NodeJS.Timeout
}

const HEARTBEAT_INTERVAL = 30000
const CLEANUP_TIMEOUT = 3600000
const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3002'
    }
  })
}