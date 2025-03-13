import { Request } from "express";
import { getFiles, getNameFromFullname, handleUploadImage, handleUploadVideo, handleUploadVideoHLS } from '~/utils/file'
import sharp from 'sharp';
import path from 'path'
import fs from 'fs'
import { UPLOAD_IMAGES_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_HLS_DIR } from '~/constants/dir'
import fsPromise from 'fs/promises'
import mime from 'mime'
import { envConfig, isProduction } from "~/constants/config";
import { EncodingStatus, MediaType } from "~/constants/enums";
import { Media } from "~/models/Other";
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class Queue {
    items: string[]
    encoding: boolean
    constructor() {
        this.items = []
        this.encoding = false
    }

    async enqueue(item: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.items.push(item)
            const idName = path.basename(item)
            
            databaseService.videoStatus
                .insertOne(
                    new VideoStatus({
                        name: idName,
                        status: EncodingStatus.Pending
                    })
                )
                .then(() => {
                    this.processEncode(resolve, reject)
                })
                .catch(reject)
        })
    }

    async processEncode(onComplete?: (m3u8Url: string) => void, onError?: (error: any) => void) {
        if (this.encoding || this.items.length === 0) {
            if (this.items.length === 0) {
                console.log('Encode video queue is empty')
            }
            return
        }
        
        this.encoding = true
        const videoPath = this.items[0]
        const idName = path.basename(videoPath)

        try {
            await databaseService.videoStatus.updateOne(
                { name: idName },
                {
                    $set: {
                        status: EncodingStatus.Processing
                    },
                    $currentDate: {
                        update_at: true
                    }
                }
            )

            await encodeHLSWithMultipleVideoStreams(videoPath)
            this.items.shift()

            const files = getFiles(path.resolve(UPLOAD_VIDEO_HLS_DIR, idName))
            let m3u8Url = ''

            const uploadPromises = files.map(async (filepath) => {
                const fileName = 'videos-hls/' + filepath.replace(path.resolve(UPLOAD_VIDEO_HLS_DIR), '').replace(/\\/g, '/')
                const contentType = mime.getType(filepath) || 'application/octet-stream'
                
                const s3Upload = await uploadFileS3({
                    filePath: filepath,
                    filename: fileName,
                    contentType
                })

                if (filepath.endsWith('/master.m3u8')) {
                    m3u8Url = (s3Upload as CompleteMultipartUploadCommandOutput).Location as string
                }
                return s3Upload
            })

            await Promise.all(uploadPromises)

            await fs.promises.unlink(videoPath)
            await databaseService.videoStatus.updateOne(
                { name: idName },
                {
                    $set: {
                        status: EncodingStatus.Success
                    },
                    $currentDate: {
                        update_at: true
                    }
                }
            )

            console.log(`Encode video ${videoPath} success`)

            if (onComplete && m3u8Url) onComplete(m3u8Url)
        } catch (error) {
            await databaseService.videoStatus
                .updateOne(
                    { name: idName },
                    {
                        $set: {
                            status: EncodingStatus.Failed
                        },
                        $currentDate: {
                            update_at: true
                        }
                    }
                )
                .catch((err) => {
                    console.error('Update video status error', err)
                })
            
            console.error(`Encode video ${videoPath} error`, error)
            if (onError) onError(error)
        } finally {
            this.encoding = false
            setImmediate(() => this.processEncode())
        }
    }
}

const queue = new Queue()

class MediaService {
    async uploadImage(req: Request) {
        const files = await handleUploadImage(req)
        
        const uploadPromises = files.map(async (file) => {
            try {
                const newName = getNameFromFullname(file.newFilename)
                const newFullFileName = `${newName}.jpg`
                const newPath = path.resolve(UPLOAD_IMAGES_DIR, newFullFileName)
                
                await sharp(file.filepath)
                    .jpeg({ quality: 80, progressive: true }) // Add compression and progressive loading
                    .toFile(newPath)
                
                const s3Result = await uploadFileS3({
                    filename: 'Images/' + newFullFileName,
                    filePath: newPath,
                    contentType: mime.getType(newFullFileName) || 'image/jpeg'
                })
                
                await Promise.all([
                    fsPromise.unlink(file.filepath), 
                    fsPromise.unlink(newPath)
                ])
                
                return {
                    url: (s3Result as CompleteMultipartUploadCommandOutput).Location,
                    type: MediaType.Image
                }
            } catch (error) {
                console.error('Error processing image upload:', error)
                throw error
            }
        })
        
        return Promise.all(uploadPromises)
    }

    async uploadVideo(req: Request) {
        const files = await handleUploadVideo(req)
        
        const uploadPromises = files.map(async (file) => {
            try {
                const s3Result = await uploadFileS3({
                    filename: 'Videos/' + file.newFilename,
                    contentType: file.mimetype || 'video/mp4',
                    filePath: file.filepath
                })
                
                const newPath = path.resolve(UPLOAD_VIDEO_DIR, `${file.newFilename}.mp4`)
                await fs.promises.copyFile(file.filepath, newPath)
                
                await Promise.all([
                    fsPromise.unlink(file.filepath),
                    fsPromise.unlink(newPath)
                ])
                
                return {
                    url: (s3Result as CompleteMultipartUploadCommandOutput).Location,
                    type: MediaType.Video
                }
            } catch (error) {
                console.error('Error processing video upload:', error)
                throw error
            }
        })
        
        return Promise.all(uploadPromises)
    }

    async uploadVideoHLS(req: Request) {
        const files = await handleUploadVideoHLS(req)

        const uploadPromises = files.map(async (file) => {
            try {
                const m3u8Url = await queue.enqueue(file.filepath)
                
                return {
                    url: m3u8Url,
                    type: MediaType.HLS
                }
            } catch (error) {
                console.error('Error processing HLS video upload:', error)
                throw error
            }
        })

        return Promise.all(uploadPromises)
    }

    async getVideoStatus(idStatus: string) {
        return databaseService.videoStatus.findOne({ name: idStatus })
    }
    
    async deleteLinkInTweet(link: string) {
        const result = await databaseService.tweets.findOne(
            {
                medias: {
                    $elemMatch: {
                        url: link
                    }
                }
            },
            { projection: { _id: 1 } }
        )
        
        if (result) {
            await databaseService.tweets.updateOne(
                { _id: result._id },
                {
                    $pull: {
                        medias: {
                            url: link
                        }
                    }
                }
            )
        }
        
        return !!result
    }
}

const mediaService = new MediaService()
export default mediaService