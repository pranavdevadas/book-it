import express from 'express'
let router = express.Router()
import userController from '../controller/userController.js'
import { userProtect } from '../middleware/userAuthMiddleware.js'


router.post('/', userController.registerUser)
router.post('/auth', userController.authUser)
router.post('/logout', userController.logoutUser)
router.route('/profile')
                        .get(userProtect, userController.getUserProfile)
                        .put(userProtect, userController.updateUserProfile)

export default router