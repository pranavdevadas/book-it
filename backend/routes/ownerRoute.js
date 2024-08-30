import express from 'express'
let router = express.Router()
import { ownerProtect } from '../middleware/ownerAuthMiddleware.js'
import ownerController from '../controller/ownerController.js'
import theatreController from '../controller/theatreController.js'

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
router.post('/owner-addtheatre', ownerProtect, theatreController.addTheatre)
//city managment
router.get('/owner-city',ownerProtect, ownerController.getCities)

export default router