import express from 'express'
let router = express.Router()
import userController from '../controller/userController.js'
import { userProtect } from '../middleware/userAuthMiddleware.js'
import showController from '../controller/showController.js'
import movieController from '../controller/movieController.js'
import bookingController from '../controller/bookingController.js'
import theatreController from '../controller/theatreController.js'

// Autherisation
router.post('/', userController.registerUser)
router.post('/auth', userController.authUser)
router.post('/logout', userController.logoutUser)
router.post('/verify-otp', userController.verifyOtp)
router.post('/resend-otp', userController.resendOtp)
router.post('/google', userController.google)
router.get('/fetchData', userProtect, userController.fetchData)
router.post('/send-mob-otp', userController.sendOtpToMobile)
router.post('/confirm-otp', userController.confirmOtpAndChangePassword)

// Profile
router.route('/profile')
                        .get(userProtect, userController.getUserProfile)
                        .put(userProtect, userController.updateUserProfile)

//Show
router.get('/get-show', showController.getShowForUser)
router.get('/get-available-shows/:id', showController.getAvailableShow)

//Movies
router.get('/get-movies', userController.getAllmovies)
router.get('/movie/:id', userProtect, movieController.getMovieById)

//Saved Movies
router.post('/add-saved-movie', userProtect, userController.addSavedMovie)
router.get('/get-savedmovies', userProtect, userController.savedMovies)
router.delete('/remove-savedmovie/:id', userProtect, userController.removeSavedMovie)


//Banner
router.get('/banner-display', userController.bannerDisplay)

//Booking
router.get('/get-seats/:theatreId/:screen', bookingController.getSeatsForBooking);
router.get('/theatre/:id', userProtect, theatreController.getTheatreById)
router.post('/create-booking', userProtect, bookingController.createBooking)
router.get('/get-availableseats', userProtect, bookingController.getBookingForSeats)
router.get('/ticket', userProtect, bookingController.getTickets)
router.post('/update-booking', userProtect, bookingController.updateBooking)

//Rating
router.post('/rating-review', userProtect, movieController.addRatingAndReview)
router.get('/get-review/:movieId', userProtect, movieController.getAllReview)


export default router