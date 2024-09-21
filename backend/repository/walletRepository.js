import Wallet from "../model/wallet.js";
import Transaction from "../model/transaction.js";

const walletRepository = {
  findByUserId: async (userId) => {
    return await Wallet.findOne({ userId });
  },

  createWallet: async (userId, amount) => {
    const newWallet = new Wallet({ userId: userId, balance: amount });
    return await newWallet.save();
  },

  updateWalletBalance: async (userId, amount) => {
    return Wallet.findOneAndUpdate(
      { userId: userId },
      { $inc: { balance: amount } },
      { new: true }
    );
  },

  findTransactionsByUserId: async (userId) => {
    return await Transaction.find({ userId }).sort({ date: -1 });
  },

  createTransaction: async ({ userId, amount, status, type }) => {
    const transaction = new Transaction({
      userId,
      amount,
      status,
      type,
    });
    return await transaction.save();
  },
};

export default walletRepository;
