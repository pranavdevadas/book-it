import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'


router.post('/auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)

export default router