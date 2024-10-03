import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import User from "../model/user.js";

const userProtect = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.userJwt;

  console.log(token)
  console.log(process.env.JWT_SECRET_USER)

  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
      let user = await User.findById(decoded.userId).select("-password");

      if (user.isBlocked) {
        res.clearCookie("userJwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.status(401);
        throw new Error("Your account is blocked. You have been logged out.");
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401);
      throw new Error("Not Authorized, Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized, No token");
  }
});

export { userProtect };
