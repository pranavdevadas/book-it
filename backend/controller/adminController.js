import expressAsyncHandler from "express-async-handler";
import adminGenerateToken from "../utils/adminGenerateToken.js";
import adminService from "../service/adminService.js";
import Banner from '../model/banner.js'

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

  addCity: expressAsyncHandler(async (req, res) => {
    let { name } = req.body;

    try {
      if (!name) {
        res.status(400).json({ message: "Enter City Name" });
        
      } else {
        let { city } = await adminService.addCity(name);
        res.status(200).json({
          _id: city._id,
          name: city.name,
        });
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getCity: expressAsyncHandler(async (req, res) => {    
    try {
      let { city } = await adminService.getCity();

      res.status(200).json(city);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getUsers: expressAsyncHandler(async (req, res) => {
    try {
      let { users } = await adminService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  blockUnblockUser: expressAsyncHandler(async (req, res) => {
    try {
      let { updatedUser } = await adminService.blockUnblockUser(req.params.id);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  getOwners: expressAsyncHandler(async (req, res) => {
    try {
      let { owners } = await adminService.getOwners();
      res.status(200).json(owners);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  blockUnblockOwner: expressAsyncHandler(async (req, res) => {
    try {
      let { updatedOwner } = await adminService.blockUnblockOwner(
        req.params.id
      );
      res.status(200).json(updatedOwner);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }),

  bannerManagment: expressAsyncHandler(async (req, res) => {
    try {
      console.log(req.files);
      let banner = await Banner.findOne();
      if (!banner) {
        banner = new Banner();
      }
      const { files } = req;

      if (files.banner1) {
        banner.banner1 = `/banner/${files.banner1[0].filename}`;
      }
      if (files.banner2) {
        banner.banner2 = `/banner/${files.banner2[0].filename}`;
      }
      if (files.banner3) {
        banner.banner3 = `/banner/${files.banner3[0].filename}`;
      }
      await banner.save();

      res.status(200).json({ message: "Banners updated successfully", banner });
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }),

  getBanner: expressAsyncHandler(async (req, res) => {
    try {
      const banner = await Banner.findOne();

      if (!banner) {
        return res.status(404).json({ message: "No banners found" });
      }
  
      res.status(200).json(banner);
    } catch (error) {
      res.status(400)
      throw new Error(error.message)
    }
  }),
};

export default adminController;
