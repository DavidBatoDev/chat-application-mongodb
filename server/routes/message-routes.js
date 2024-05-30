import express from 'express'
import {
    sendMessage,
    fetchMessages
} from '../controllers/message-controller.js'
import { authorizationHandler } from '../utils/authorizationHandler.js'

const router = express.Router()

router.post('/', authorizationHandler, sendMessage)

router.get('/:chatId', authorizationHandler, fetchMessages)

export default router