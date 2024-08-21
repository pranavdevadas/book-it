import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'


router.post('/admin-auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)

export default router