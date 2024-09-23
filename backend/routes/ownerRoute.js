import express from 'express'
let router = express.Router()
import { ownerProtect } from '../middleware/ownerAuthMiddleware.js'
import ownerController from '../controller/ownerController.js'
import theatreController from '../controller/theatreController.js'
import showController from '../controller/showController.js'
import bookingController from '../controller/bookingController.js'

//Authentication
router.post('/owner-auth', ownerController.authOwner)
router.post('/owner-register', ownerController.registerOwner)
router.post('/owner-logout',ownerController.logoutOwner)
router.post('/owner-verify-otp', ownerController.verifyOtp)
router.post('/owner-resend-otp', ownerController.resendOtp)
// router.get('/owner/fetchData', ownerController.fetchData)

//Profile
router.route('/owner-profile')
                            .get(ownerProtect, ownerController.getOwnerProfile)
                            .put(ownerProtect, ownerController.updateOwnerProfile)


//Theatre           
router.get('/owner-theatres', ownerProtect, theatreController.getTheatres) 
router.get('/owner-listedtheatres', ownerProtect, theatreController.getListedTheatres) 
router.post('/owner-addtheatre', ownerProtect, theatreController.addTheatre)
router.route('/theatre/:id')
                            .get(ownerProtect, theatreController.getTheatreById)
                            .put(ownerProtect, theatreController.editTheatre)
router.patch('/theatre/:id/toggle-status', ownerProtect, theatreController.toggleTheatreStatus)

//city
router.get('/owner-city',ownerProtect, ownerController.getCities)

//Now Showing
router.get('/owner-nowshowing', ownerProtect, showController.getShows)
router.get('/owner-getmovies', ownerProtect, showController.getAllMovies)
router.post('/owner-addshow', ownerProtect, showController.addShow)
router.patch('/show/:id/toggle-status', ownerProtect, showController.toggleStatus)

//Booking
router.get('/owner-getbookings', ownerProtect, bookingController.OwnerBookings)

//HomeScreen
router.get('/top-movies', ownerController.topMovies)

export default router