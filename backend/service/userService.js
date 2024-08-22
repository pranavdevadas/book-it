import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import userRepository from "../repository/userRepository.js";

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

    if (!user.isVerified) {
      return { isVerified: false, otp: user.otp, email: user.email };
    }

    return { user, isVerified: true };
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
};

export default userService;
