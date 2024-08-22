import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import Owner from '../model/owner.js'

let ownerProtect = expressAsyncHandler( async(req, res, next) => {
    let token
    token = req.cookies.ownerJwt    
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.JWT_SECRET_OWNER)                        
            req.owner = await Owner.findById(decoded.userId).select('-password')
            
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

export { ownerProtect }