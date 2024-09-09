import express from 'express'
let router = express.Router()
import userController from '../controller/userController.js'
import { userProtect } from '../middleware/userAuthMiddleware.js'
import showController from '../controller/showController.js'
import movieController from '../controller/movieController.js'

// Autherisation
router.post('/', userController.registerUser)
router.post('/auth', userController.authUser)
router.post('/logout', userController.logoutUser)
router.post('/verify-otp', userController.verifyOtp)
router.post('/resend-otp', userController.resendOtp)
router.post('/google', userController.google)
router.get('/fetchData', userProtect, userController.fetchData)

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


export default router