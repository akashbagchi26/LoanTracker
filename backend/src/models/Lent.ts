import mongoose, { Schema, Types } from "mongoose";

const lentSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },

    contact: {
      phone_no: { type: Number },
      email: { type: String },
    },

    loan_summery: {
      active_loan: { type: Number, default: 0 },
      total_outstanding_amount: { type: Number, default: 0 },
      total_monthly_payment_due: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lent", lentSchema);
