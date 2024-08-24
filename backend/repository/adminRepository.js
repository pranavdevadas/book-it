import Admin from "../model/admin.js";
import City from "../model/city.js";

let adminRepository = {
  findAdminByEmail: async (email) => {
    return await Admin.findOne({ email });
  },

  findCity: async (name) => {
    return await City.findOne({ name });
  },

  createCity: async (city) => {
    return await City.create(city)
  },

  findCities: async () => {
    return await City.find()
  },

  
};

export default adminRepository;
