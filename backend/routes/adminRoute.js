import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'
import movieController from '../controller/movieController.js'


router.post('/admin-auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)
router.route('/admin-movie') 
                            .get(adminProtect, movieController.getMovie)
                            .post(adminProtect, movieController.addMovie)
router.patch('/movie/:id/toggle-status', adminProtect, movieController.toggleListStatus);
router.route('/movie/:id')
                            .patch(adminProtect, movieController.editMovie)
                            .get(adminProtect, movieController.getMovieById)
router.route('/admin-city')
                            .get(adminProtect ,adminController.getCity)
                            .post(adminProtect ,adminController.addCity)

export default router