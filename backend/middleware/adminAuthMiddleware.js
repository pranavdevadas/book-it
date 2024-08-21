import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import Admin from '../model/admin.js'

let adminProtect = expressAsyncHandler( async(req, res, next) => {
    let token
    token = req.cookies.adminJwt    
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)            
            req.admin = await Admin.findById(decoded.adminId).select('-password')
            next()
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401)
            throw new Error('Not Authorized, Invalid token')
        }
    } else {
        res.status(401)
        throw new Error('Not Authorized, No token')
    }
})

export { adminProtect }