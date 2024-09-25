import express from 'express'
const router = express.Router()
import chatController from '../controller/chatController.js'


router.get('/chats/:userId/:ownerId', chatController.getChat)
router.post('/chat', chatController.saveChat)
router.get('/chat-list/:ownerId', chatController.chatList)
router.get('/chat-details/:chatId', chatController.getChatOwner)
router.post('/chat-save', chatController.saveChatOwner)

export default router