import walletRepository from "../repository/walletRepository.js";

const walletService = {
  addAmountToWallet: async (userId, amount) => {
    const parsedAmount = parseInt(amount);

    let wallet = await walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = await walletRepository.createWallet(userId, parsedAmount);
    } else {
      wallet = await walletRepository.updateWalletBalance(userId, parsedAmount);
    }

    await walletRepository.createTransaction({
      userId,
      amount: parsedAmount,
      status: "Success",
      type: "Credit",
    });

    return wallet;
  },

  getTransaction: async (userId) => {
    const transaction = await walletRepository.findTransactionsByUserId(userId);

    return transaction;
  },

  getWalletBalance: async (userId) => {
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error("Wallet now found");
    }
    return wallet.balance;
  },
};

export default walletService;
