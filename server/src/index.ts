import express from "express";
import databaseService from "./services/database.services";
import usersRouter from "./routes/user.routes";
import { config } from 'dotenv'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import { envConfig } from "./constants/config";
import helmet from 'helmet'
import { hostname } from "os";
import { tweetsRouter } from "./routes/tweet.routes";
import { commentsRouter } from "./routes/comment.routes";
import bookmarksRouter from "./routes/bookmarks.routes";
import conversationsRouter from "./routes/conversations.routes";
import storiesRouter from "./routes/stories.routes";
config()
databaseService
  .connect()
  .then(() => {
    databaseService.indexUsers()
    databaseService.indexFollowers()

  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  });
const app = express()
const httpServer = createServer(app)
const port = envConfig.port || 3002
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/users/', usersRouter)
app.use('/tweets/', tweetsRouter)
app.use('/comments/', commentsRouter)
app.use('/bookmarks/', bookmarksRouter)
app.use('/conversations', conversationsRouter)
app.use('/stories', storiesRouter)

interface ErrorResponse {
  message: string;
  stack?: string;
}

app.use((err: Error & { status?: number }, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error Handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Unexpected error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  } as ErrorResponse);
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});