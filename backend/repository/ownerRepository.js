import Owner from "../model/owner.js";

let ownerRepository = {
  findOwnerByEmail: async (email) => {
    return await Owner.findOne({ email });
  },
  
  findOwnerById: async (Id) => {
    return await Owner.findById(Id)
  },
  
  createOwner: async (ownerData) => {
    return await Owner.create(ownerData)
  },

  saveOwner: async (owner) => {
    return await owner.save()
  },

  findOwners: async () => {
    return await Owner.find()
  },

  
};

export default ownerRepository;
