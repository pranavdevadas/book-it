import jwt from "jsonwebtoken";

let ownerGenerateToken = (res, userId) => {
    let token = jwt.sign({userId}, process.env.JWT_SECRET_OWNER, {
        expiresIn : '30d'
    })

    res.cookie('ownerJwt', token, {
        httpOnly : true,
        secure : true,
        sameSite : 'None',
        maxAge : 30 * 24 * 60 * 60 * 100
    })
}

export default ownerGenerateToken