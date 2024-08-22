import expressAsyncHandler from "express-async-handler";
import ownerService from "../service/ownerService.js";
import ownerGenerateToken from "../utils/ownerGenerateToken.js";

let ownerController = {
  authOwner: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      let result = await ownerService.authenticateOwner(email, password);

      const { owner, isVerified, otp } = result;

      if (!isVerified) {
        return res
          .status(200)
          .json({ message: "Owner Not Verified", otp, email });
      } else {
        ownerGenerateToken(res, owner._id);
        return res
          .status(200)
          .json({ message: "Authentication Successful", owner });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  registerOwner: expressAsyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
      let { owner } = await ownerService.registerOwner(
        name,
        email,
        phone,
        password
      );

      res.status(200).json({
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  logoutOwner: expressAsyncHandler(async (req, res) => {
    try {
      let cookieOptions = ownerService.logoutOwner();
      res.cookie("ownerJwt", cookieOptions.value, {
        httpOnly: cookieOptions.httpOnly,
        expires: cookieOptions.expires,
      });
      res.status(200).json({ message: "Owner Logged Out" });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getOwnerProfile: expressAsyncHandler(async (req, res) => {
    
    try {
      let owner = ownerService.getOwnerProfile(req.owner);
      res.status(200).json({ owner });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  updateOwnerProfile: expressAsyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body;
    
    try {
      let updateOwner = await ownerService.updateOwnerProfile(req.owner._id, {
        name,
        email,
        phone,
        password,
      });
      res.status(200).json({
        _id: updateOwner._id,
        name: updateOwner.name,
        email: updateOwner.email,
        phone: updateOwner.phone,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),
};

export default ownerController;
