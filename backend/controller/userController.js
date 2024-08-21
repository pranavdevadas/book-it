import expressAsyncHandler from "express-async-handler";
import userService from "../service/userService.js";
import userGenerateToken from "../utils/userGenerateToken.js";

const userController = {
  authUser: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user, isVerified, otp } = await userService.authenticateUser(email, password);

      if (!isVerified) {
        res.status(200).json({ message: "User Not Verified", otp, email });
      } else {
        userGenerateToken(res, user._id);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isVerified: user.isVerified,
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  verifyOtp: expressAsyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    try {
      const result = await userService.verifyOtp(email, otp);
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  resendOtp: expressAsyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      const result = await userService.resendOtp(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(404);
      throw new Error(error.message);
    }
  }),

  registerUser: expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
      const { user } = await userService.registerUser({ name, email, phone, password });
      userGenerateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        otp: user.otp,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  logoutUser: expressAsyncHandler(async (req, res) => {
    const cookieOptions = userService.logoutUser();
    res.cookie("userJwt", cookieOptions.value, {
      httpOnly: cookieOptions.httpOnly,
      expires: cookieOptions.expires,
    });
    res.status(200).json({ message: "User Logged out" });
  }),

  getUserProfile: expressAsyncHandler(async (req, res) => {
    const user = userService.getUserProfile(req.user);
    res.status(200).json({ user });
  }),

  updateUserProfile: expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
      const updatedUser = await userService.updateUserProfile(req.user._id, { name, email, phone, password });
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default userController;
