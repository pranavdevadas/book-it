import express from 'express'
let router = express.Router()
import adminController from '../controller/adminController.js'
import { adminProtect } from '../middleware/adminAuthMiddleware.js'
import movieController from '../controller/movieController.js'


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
                            .get(adminProtect ,adminController.getCity)
                            .post(adminProtect ,adminController.addCity)

//User Operations                            
router.get('/admin-user', adminProtect, adminController.getUsers)
router.patch('/:id/blockUnblockUser', adminProtect, adminController.blockUnblockUser);
router.get('/admin-owner', adminProtect, adminController.getOwners)
router.patch('/:id/blockUnblockOwner', adminProtect, adminController.blockUnblockOwner);

export default router