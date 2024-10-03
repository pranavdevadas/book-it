import jwt from "jsonwebtoken";

let userGenerateToken = (res, userId) => {
    try {
        let token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
            expiresIn: '30d'
        });

        res.cookie('userJwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    } catch (error) {
        console.error("Error generating token or setting cookie:", error.message);
        res.status(500).json({ message: "Internal server error while generating token." });
    }
};

export default userGenerateToken;
