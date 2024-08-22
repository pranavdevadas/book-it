import express from 'express'
let router = express.Router()
import { ownerProtect } from '../middleware/ownerAuthMiddleware.js'
import ownerController from '../controller/ownerController.js'

router.post('/owner-auth', ownerController.authOwner)
router.post('/owner-register', ownerController.registerOwner)
router.post('/owner-logout',ownerController.logoutOwner)
router.route('/owner-profile')
                            .get(ownerProtect, ownerController.getOwnerProfile)
                            .put(ownerProtect, ownerController.updateOwnerProfile)

export default router