import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/user.js";

const userProtect = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.userJwt;

  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
      let user = await User.findById(decoded.userId).select("-password");
      console.log('decoded',decoded)
      console.log('user',user)
      if (user.isBlocked) {
        console.log('hnjhkjj')
        res.clearCookie("userJwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.status(401);
        throw new Error("Your account is blocked. You have been logged out.");
      }
      console.log('njdjhdkj')
      req.user = user;
      console.log('done')
      next();
    } catch (error) {
      console.log('erar', error)
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error("Not Authorized, Invalid token");
    }
  } else {
    console.log('no Token')
    res.status(401);
    throw new Error("Not Authorized, No token");
  }
});

export { userProtect };
