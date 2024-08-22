import Admin from "../model/admin.js";

let adminRepository = {
  findAdminByEmail: async (email) => {
    return await Admin.findOne({ email });
  },
};

export default adminRepository;
