import adminRepository from '../repository/adminRepository.js'

let adminService = {
    authenticateAdmin: async (email, password) => {
        const admin = await adminRepository.findAdminByEmail(email);
        if (admin && await admin.matchPassword(password)) {
          return admin;
        } else {
          throw new Error('Invalid Email or Password');
        }
      },
      logoutAdmin: () => {
        return {
          httpOnly: true,
          expires: new Date(0),
          value: '',
        };
      },
}

export default adminService