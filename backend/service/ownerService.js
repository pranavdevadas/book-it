import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ownerRepository from "../repository/ownerRepository.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

let ownerService = {
  authenticateOwner: async (email, password) => {
    let owner = await ownerRepository.findOwnerByEmail(email);

    if (!owner) {
      throw new Error("Invalid Email or Password");
    }

    let checkPass = await bcrypt.compare(password, owner.password);
    if (!checkPass) {
      throw new Error("Invalid Email or Password");
    }
    if (!owner.isVerified) {
      return { isVerified: false, otp: owner.otp, email: owner.email };
    }
    return { owner, isVerified: true };
  },

  registerOwner: async (name, email, phone, password) => {
    let existingOwner = await ownerRepository.findOwnerByEmail(email);
    if (existingOwner) {
      throw new Error("Owner already Exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000);

    let owner = await ownerRepository.createOwner({
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

    return { owner };
  },

  logoutOwner: () => {
    return {
      httpOnly: true,
      expires: new Date(0),
      value: "",
    };
  },

  getOwnerProfile: (owner) => {
    return {
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
    };
  },

  updateOwnerProfile: async (ownerId, { name, email, phone, password }) => {
    let owner = await ownerRepository.findOwnerById(ownerId);
    if (!owner) {
      throw new Error("Owner Not Found");
    }

    (owner.name = name || owner.name),
      (owner.email = email || owner.email),
      (owner.phone = phone || owner.phone);

    if (password) {
      const salt = await bcrypt.genSalt(10);
      owner.password = await bcrypt.hash(password, salt);
    }

    let updateOwner = await ownerRepository.saveOwner(owner);
    return updateOwner;
  },

  verifyOtp: async (email, otp) => {

    let owner = await ownerRepository.findOwnerByEmail(email);    

    if (!owner) {
      throw new Error("Owner Not Found");
    }

    if (otp !== owner.otp) {
      throw new Error("Invalid OTP");
    }    

    owner.isVerified = true;
    await ownerRepository.saveOwner(owner);
    
    return { message: "OTP Verified" };
  },

  resendOtp: async (email) => {
    let owner = await ownerRepository.findOwnerByEmail(email);

    if (!owner) {
      throw new Error("Owner Not Found");
    }

    owner.otp = Math.floor(100000 + Math.random() * 900000);
    await ownerRepository.saveOwner(owner);

    const mailOptions = {
      from: "pranavdevadas2@gmail.com",
      to: owner.email,
      subject: "OTP Verification",
      text: `Your OTP is: ${owner.otp}`,
    };

    await transporter.sendMail(mailOptions);

    return { message: "OTP Resent" };
  },

  getOwnerById: async (id) => {
    let owner = await ownerRepository.findOwnerById(id)
    return owner
  }
};

export default ownerService;
