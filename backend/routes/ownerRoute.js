import express from 'express'
let router = express.Router()
import { ownerProtect } from '../middleware/ownerAuthMiddleware.js'
import ownerController from '../controller/ownerController.js'
import theatreController from '../controller/theatreController.js'
import showController from '../controller/showController.js'

//Authentication
router.post('/owner-auth', ownerController.authOwner)
router.post('/owner-register', ownerController.registerOwner)
router.post('/owner-logout',ownerController.logoutOwner)
router.post('/owner-verify-otp', ownerController.verifyOtp)
router.post('/owner-resend-otp', ownerController.resendOtp)
// router.get('/owner/fetchData', ownerController.fetchData)

//Profile managment
router.route('/owner-profile')
                            .get(ownerProtect, ownerController.getOwnerProfile)
                            .put(ownerProtect, ownerController.updateOwnerProfile)


//Theatre managmant           
router.get('/owner-theatres', ownerProtect, theatreController.getTheatres) 
router.post('/owner-addtheatre', ownerProtect, theatreController.addTheatre)
router.route('/theatre/:id')
                            .get(ownerProtect, theatreController.getTheatreById)
                            .put(ownerProtect, theatreController.editTheatre)
router.patch('/theatre/:id/toggle-status', ownerProtect, theatreController.toggleTheatreStatus)

//city managment
router.get('/owner-city',ownerProtect, ownerController.getCities)

//Now Showing
router.get('/owner-nowshowing', ownerProtect, showController.getShows)
router.get('/owner-getmovies', ownerProtect, showController.getAllMovies)
router.post('/owner-addshow', ownerProtect, showController.addShow)
router.patch('/show/:id/toggle-status', ownerProtect, showController.toggleStatus)

export default router