import expressAsyncHandler from "express-async-handler"
import adminGenerateToken from '../utils/adminGenerateToken.js'
import Admin from '../model/admin.js'

let adminController = {
    authAdmin : expressAsyncHandler( async(req, res) => {
        let { email, password } = req.body

        let admin = await Admin.findOne({ email })
        console.log(admin);
        
        if (admin && admin.matchPassword(password)) {
            adminGenerateToken(res, admin._id)
            res.status(200).json({
                admin 
            });
        } else {
            res.status(400);
            throw new Error('Invalid Email or Password');
        }
    }),
    
    logoutAdmin : expressAsyncHandler( async(req, res) => {
        res.cookie('adminJwt','', {
            httpOnly : true,
            expires : new Date(0)
        })
        res.status(200).json({message : 'admin Logged out'})
    }),

}

export default adminController