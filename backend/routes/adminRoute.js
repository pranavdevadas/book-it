import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'
import movieController from '../controller/movieController.js'
import theatreController from '../controller/theatreController.js'
import { uploadBanner } from '../config/multer.js'
import BookingController from '../controller/bookingController.js'


//Admin Autherisation
router.post('/admin-auth', adminController.authAdmin)
router.post('/logout', adminController.logoutAdmin)

//Movie
router.route('/admin-movie')
                            .get(adminProtect, movieController.getMovie)
                            .post(adminProtect, movieController.addMovie)
router.patch('/movie/:id/toggle-status', adminProtect, movieController.toggleListStatus);
router.route('/movie/:id')
                            .patch(adminProtect, movieController.editMovie)
                            .get(adminProtect, movieController.getMovieById)

//City                           
router.route('/admin-city')
                            .get(adminController.getCity)
                            .post(adminProtect ,adminController.addCity)

//User                            
router.get('/admin-user', adminProtect, adminController.getUsers)
router.patch('/:id/blockUnblockUser', adminProtect, adminController.blockUnblockUser);

//Owner
router.get('/admin-owner', adminProtect, adminController.getOwners)
router.patch('/:id/blockUnblockOwner', adminProtect, adminController.blockUnblockOwner);

//Theatre
router.get('/admin-theatres', adminProtect, theatreController.getTheatresForAdmin)

//Banner
router.route('/banner') 
                        .patch(adminProtect, uploadBanner, adminController.bannerManagment)
                        .get(adminProtect, adminController.getBanner)


//HomePage
router.get('/bookings', BookingController.getBookings)

export default router