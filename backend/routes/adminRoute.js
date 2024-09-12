import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'
import movieController from '../controller/movieController.js'
import theatreController from '../controller/theatreController.js'
import { uploadBanner } from '../config/multer.js'


//Admin Autherisation
router.post('/admin-auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)

//Movie Operations
router.route('/admin-movie')
                            .get(adminProtect, movieController.getMovie)
                            .post(adminProtect, movieController.addMovie)
router.patch('/movie/:id/toggle-status', adminProtect, movieController.toggleListStatus);
router.route('/movie/:id')
                            .patch(adminProtect, movieController.editMovie)
                            .get(adminProtect, movieController.getMovieById)

//City Operations                           
router.route('/admin-city')
                            .get(adminController.getCity)
                            .post(adminProtect ,adminController.addCity)

//User Operations                            
router.get('/admin-user', adminProtect, adminController.getUsers)
router.patch('/:id/blockUnblockUser', adminProtect, adminController.blockUnblockUser);

//Owner Operations
router.get('/admin-owner', adminProtect, adminController.getOwners)
router.patch('/:id/blockUnblockOwner', adminProtect, adminController.blockUnblockOwner);

//Theatre Operations
router.get('/admin-theatres', adminProtect, theatreController.getTheatresForAdmin)

//Banner Operations
router.route('/banner') 
                        .patch(adminProtect, uploadBanner, adminController.bannerManagment)
                        .get(adminProtect, adminController.getBanner)

export default router