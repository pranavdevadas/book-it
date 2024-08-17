import expressAsyncHandler from "express-async-handler";
import User from "../model/user.js";
import userGenerateToken from "../utils/userGenerateToken.js";
import bcrypt from "bcryptjs";

let userController = {
  authUser: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }

    let checkPass = await bcrypt.compare(password, user.password);

    if (checkPass) {
      userGenerateToken(res, user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        user,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Email or Password");
    }
  }),

  registerUser: expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
      throw new Error("User Already Exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    if (user) {
      userGenerateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  }),
  logoutUser: expressAsyncHandler(async (req, res) => {
    res.cookie("userJwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "user Logged out" });
  }),
  getUserProfile: expressAsyncHandler(async (req, res) => {
    let user = {
      _id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.phone,
    };
    res.status(200).json({ user });
  }),
  updateUserProfile: expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      const updated = await user.save();
      res.status(200).json({
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  }),
};

export default userController;
