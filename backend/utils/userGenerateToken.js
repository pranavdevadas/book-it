import jwt from "jsonwebtoken";

let userGenerateToken = (res, userId) => {
    console.log('jjjdj')
    let token = jwt.sign({userId}, process.env.JWT_SECRET_USER, {
        expiresIn : '30d'
    })
    console.log('nnnnnn')
    res.cookie('userJwt', token, {
        httpOnly : true,
        secure : true,
        sameSite : 'None',
        maxAge : 30 * 24 * 60 * 60 * 100
    })
    console.log('llljjjj')
}

export default userGenerateToken