import { Request } from "express";
import { getFiles } from "~/utils/file";
import sharp from 'sharp';
import path from 'path'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { envConfig, isProduction } from "~/constants/config";
import { EncodingStatus, MediaType } from "~/constants/enums";
import { Media } from "~/models/Other";
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { uploadFileS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

