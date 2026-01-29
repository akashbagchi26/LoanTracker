import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    user_loan_summery: {
      active_loan: { type: Number, default: 0 },
      outstanding_amount: { type: Number, default: 0 },
      payment_due: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
