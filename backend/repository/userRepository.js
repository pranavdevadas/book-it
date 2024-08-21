import User from "../model/user.js";

let userRepository = {
    findUserByEmail: async (email) => {
        return await User.findOne({ email });
      },
    
      findUserById: async (id) => {
        return await User.findById(id);
      },
    
      createUser: async (userData) => {
        return await User.create(userData);
      },
    
      saveUser: async (user) => {
        return await user.save();
      },
};

export default userRepository;
