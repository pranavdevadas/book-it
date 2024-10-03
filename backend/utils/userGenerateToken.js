import jwt from "jsonwebtoken";

let userGenerateToken = (res, userId) => {
    let token = jwt.sign({userId}, process.env.JWT_SECRET_USER, {
        expiresIn : '30d'
    })
    
    console.log(token)

    res.cookie('userJwt', token, {
        httpOnly : true,
        secure : process.env.NODE_ENV !== 'development',
        sameSite : 'strict',
        maxAge : 30 * 24 * 60 * 60 * 100
    })
}

export default userGenerateToken