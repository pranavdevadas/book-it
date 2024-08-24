import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'
import movieController from '../controller/movieController.js'


router.post('/admin-auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)

router.post('/admin-movie', movieController.addMovie)
router.route('/admin-city')
                            .get(adminController.getCity)
                            .post(adminController.addCity)

export default router