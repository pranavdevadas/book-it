import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import userRepository from "../repository/userRepository.js";
import userGenerateToken from "../utils/userGenerateToken.js";
import twilio from "twilio";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

let userService = {
  authenticateUser: async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("Invalid Email or Password");
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      throw new Error("Invalid Email or Password");
    }

    if (user.isBlocked) {
      return { isBlocked: true };
    }

    if (!user.isVerified) {
      return { isVerified: false, otp: user.otp, email: user.email };
    }

    return { user, isVerified: true, isBlocked: false };
  },

  verifyOtp: async (email, otp) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User Not Found");
    }

    if (otp !== user.otp) {
      throw new Error("Invalid OTP");
    }

    user.isVerified = true;
    await userRepository.saveUser(user);
    return { message: "OTP Verified" };
  },

  resendOtp: async (email) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User Not Found");
    }

    user.otp = Math.floor(100000 + Math.random() * 900000);
    await userRepository.saveUser(user);

    const mailOptions = {
      from: "pranavdevadas2@gmail.com",
      to: user.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${user.otp}`,
    };

    await transporter.sendMail(mailOptions);

    return { message: "OTP Resent" };
  },

  registerUser: async ({ name, email, phone, password }) => {
    const userExist = await userRepository.findUserByEmail(email);
    if (userExist) {
      throw new Error("User Already Exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const user = await userRepository.createUser({
      name,
      email,
      phone,
      otp,
      password: hashedPassword,
    });

    const mailOptions = {
      from: "pranavdevadas2@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);

    return { user };
  },

  logoutUser: () => {
    return {
      httpOnly: true,
      expires: new Date(0),
      value: "",
    };
  },

  getUserProfile: (user) => {
    return {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };
  },

  updateUserProfile: async (userId, { name, email, phone, password }) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userRepository.saveUser(user);
    return updatedUser;
  },

  loginOrCreateGoogleUser: async (email, name, res) => {
    let user = await userRepository.findUserByEmail(email);
    if (user) {
      console.log('dddddddddd',user)
      userGenerateToken(res, user._id);

      return {
        message: "Logged In",
        name: user.name,
        email: user.email,
      };
    } else {
      console.log('nnnkk')
      let generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      let salt = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(generatedPassword, salt);

      let newUser = await userRepository.createUser({
        name: name,
        email,
        isVerified: true,
        phone: "565775757",
        password: hashedPassword,
      });

      userGenerateToken(res, newUser._id);
      console.log('service',newUser)
      return {
        message: "Login Success",
        name: newUser.name,
        email: newUser.email,
      };
    }
  },

  isBlocked: async (id) => {
    let user = await userRepository.findUserById(id);

    if (!user) {
      throw new Error("User Not Found");
    }
    return user.isBlocked;
  },

  getUserById: async (id) => {
    let user = await userRepository.findUserById(id);
    return user;
  },

  addSavedMovieService: async (userId, movieId) => {
    const savedMovie = await userRepository.findSavedMovie(userId, movieId);
    if (savedMovie) {
      throw new Error("Movie already saved");
    }
    await userRepository.updateSavedMovie(userId, movieId);
    return;
  },

  savedMovies: async (userId) => {
    const moviesList = await userRepository.findSavedMovieByUserId(userId);
    if (!moviesList) {
      throw new Error("Movie already saved");
    }
    moviesList.items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return moviesList;
  },

  removeSavedMovie: async (movieId, userId) => {
    const result = await userRepository.deleteSavedMovieById(movieId, userId);
    if (!result) {
      throw new Error("Movie not found in saved list");
    }
    return result;
  },

  bannerDisplay: async () => {
    const banners = await userRepository.findBanner();
    if (!banners) {
      throw new Error("Banner not found");
    }
    return banners;
  },

  addRatingAndReview: async (movie, rating, review, user) => {
    if (!rating || !review) {
      throw new Error("All fields are required");
    }

    const existingRating = await userRepository.findRatingByUser(user, movie);

    if (existingRating) {
      throw new Error("You have already reviewed this movie");
    }

    const createRatingAndReview = await userRepository.createRatingAndReview(
      user,
      movie,
      rating,
      review
    );

    return createRatingAndReview;
  },

  getAllReview: async (movie) => {
    const reviews = await userRepository.findReviews(movie);
    return reviews;
  },

  sendOtpToMobile: async (phone) => {
    const user = await userRepository.findByPhone(phone);

    if (!user) {
      throw new Error("You are not registered.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIOAUTHTOKEN;
    const client = new twilio(accountSid, authToken);

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+14233015018",
      to: `+91${phone}`,
    });

    return;
  },

  confirmOtpAndChangePassword: async (phone, otp, password) => {
    const user = await userRepository.findByPhone(phone);

    if (!user) {
      throw new Error("You are not registered.");
    }

    if (user.otp !== otp) {
      throw new Error("Invalid OTP.")
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long.")
    }

    user.password = await bcrypt.hash(password, 10);
    
    await user.save();

    return 
  },
};

export default userService;
