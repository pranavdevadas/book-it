import adminRepository from "../repository/adminRepository.js";

let adminService = {
  authenticateAdmin: async (email, password) => {
    const admin = await adminRepository.findAdminByEmail(email);
    if (admin && (await admin.matchPassword(password))) {
      return admin;
    } else {
      throw new Error("Invalid Email or Password");
    }
  },
  logoutAdmin: () => {
    return {
      httpOnly: true,
      expires: new Date(0),
      value: "",
    };
  },

  addCity: async (name) => {
    let existingCity = await adminRepository.findCity(name);

    if (existingCity) {
      throw new Error("City already exist");
    }

    let city = await adminRepository.createCity({ name });

    return { city };
  },

  getCity: async () => {
    let city = await adminRepository.findCities();
    
    if (!city) {
      throw new Error("City Not Found");
    }

    return { city }
  },
};

export default adminService;
