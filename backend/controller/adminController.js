import expressAsyncHandler from "express-async-handler";
import adminGenerateToken from "../utils/adminGenerateToken.js";
import adminService from "../service/adminService.js";

let adminController = {
  authAdmin: expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const admin = await adminService.authenticateAdmin(email, password);
      adminGenerateToken(res, admin._id);
      res.status(200).json({
        _id: admin._id,
        email: admin.email,
        admin,
      });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  logoutAdmin: expressAsyncHandler(async (req, res) => {
    const cookieOptions = adminService.logoutAdmin();
    res.cookie("adminJwt", cookieOptions.value, {
      httpOnly: cookieOptions.httpOnly,
      expires: cookieOptions.expires,
    });
    res.status(200).json({ message: "Admin logged out" });
  }),
};

export default adminController;
