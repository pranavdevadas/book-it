import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    require: true,
  },
  balance: {
    type: Number,
    require: true,
  },
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;