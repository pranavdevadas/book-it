import expressAsyncHandler from "express-async-handler";
import userService from "../service/userService.js";
import userGenerateToken from "../utils/userGenerateToken.js";
import showService from "../service/showService.js";

const userController = {
  authUser: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user, isVerified, otp, isBlocked } =
        await userService.authenticateUser(email, password);

      if (isBlocked) {
        res.status(403).json({
          message: "User is blocked. For more details, contact admin.",
        });
        return;
      }

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
          isBlocked: user.isBlocked,
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
      const { user } = await userService.registerUser({
        name,
        email,
        phone,
        password,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        otp: user.otp,
      });
    } catch (error) {
      console.log(error)
      res.status(400);
      throw new Error(error.message);
    }
  }),

  google: expressAsyncHandler(async (req, res) => {
    console.log("dddddd")
    let { email, name } = req.body;
    console.log('hhhhhhhhhhhhh',email,name)
    try {
      const result = await userService.loginOrCreateGoogleUser(
        email,
        name,
        res
      );
      console.log('result', result)
      res.status(200).json(result);
    } catch (error) {
      console.log(error)
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
      const updatedUser = await userService.updateUserProfile(req.user._id, {
        name,
        email,
        phone,
        password,
      });
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

  fetchData: expressAsyncHandler(async (req, res) => {
    try {
      let user = await userService.getUserById(req.user._id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getAllmovies: expressAsyncHandler(async (req, res) => {
    try {
      let movies = await showService.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  addSavedMovie: expressAsyncHandler(async (req, res) => {
    try {
      const { movieId } = req.body;
      const userId = req.user._id;

      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }
      const result = await userService.addSavedMovieService(userId, movieId);

      res.status(200).json({ message: "Movie added Successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  savedMovies: expressAsyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      const moviesList = await userService.savedMovies(userId);
      res.status(200).json(moviesList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  removeSavedMovie: expressAsyncHandler(async (req, res) => {
    const movieId = req.params.id;
    const userId = req.user._id;
    try {
      const result = await userService.removeSavedMovie(movieId, userId);
      res
        .status(200)
        .json({ message: "Movie removed from saved list", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  bannerDisplay: expressAsyncHandler(async (req, res) => {
    try {
      const banners = await userService.bannerDisplay();
      res.status(200).json(banners);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  sendOtpToMobile: expressAsyncHandler(async (req, res) => {
    try {
      const { phone } = req.body;

      await userService.sendOtpToMobile(phone);

      res.status(200).json({ message: "OTP sent successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  confirmOtpAndChangePassword: expressAsyncHandler(async (req, res) => {
    try {
      const { phone, otp, newPassword } = req.body;

      await userService.confirmOtpAndChangePassword(phone, otp, newPassword);

      res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default userController;
