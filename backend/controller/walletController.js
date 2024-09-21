import expressAsyncHandler from "express-async-handler";
import walletService from "../service/walletService.js";

const walletController = {
  addAmount: expressAsyncHandler(async (req, res) => {
    try {
      const { amount } = req.body;
      const wallet = await walletService.addAmountToWallet(
        req.user._id,
        amount
      );
      res.status(200).json(wallet);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getTransactions: expressAsyncHandler(async (req, res) => {
    try {
      const transaction = await walletService.getTransaction(req.user._id);
      res.status(200).json(transaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getWalletBalance: expressAsyncHandler(async (req, res) => {
    try {
      const balance = await walletService.getWalletBalance(req.user._id);
      res.status(200).json(balance);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
};

export default walletController;
