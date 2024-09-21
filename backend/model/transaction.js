import mongoose from "mongoose";
import moment from "moment";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  status: {
    type: String, // Success or Fail
    required: true,
  },
  type: {
    type: String, // Credit or Debit
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    get: function (val) {
      return moment(val).format("DD-MM-YYYY");
    },
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
