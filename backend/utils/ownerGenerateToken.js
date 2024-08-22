import jwt from "jsonwebtoken";

let ownerGenerateToken = (res, userId) => {
    let token = jwt.sign({userId}, process.env.JWT_SECRET_OWNER, {
        expiresIn : '30d'
    })

    res.cookie('ownerJwt', token, {
        httpOnly : true,
        secure : process.env.NODE_ENV !== 'development',
        sameSite : 'strict',
        maxAge : 30 * 24 * 60 * 60 * 1000
    })
}

export default ownerGenerateToken