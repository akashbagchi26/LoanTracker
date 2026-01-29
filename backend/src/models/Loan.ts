import mongoose, { Schema, InferSchemaType, model } from "mongoose";

/* =================================================
   Sub Schemas
================================================== */

const LoanAmountDetailsSchema = new Schema(
  {
    principal_sanction: {
      type: Number,
      required: true,
      min: 0,
    },

    total_amount_paid: {
      type: Number,
      default: 0,
      min: 0,
    },

    principal_outstanding: {
      type: Number,
      default: 0,
      min: 0,
    },

    interest_outstanding: {
      type: Number,
      default: 0,
      min: 0,
    },

    total_outstanding: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const RepaymentDetailsSchema = new Schema(
  {
    repayment_type: {
      type: String,
      enum: ["emi", "onetime"],
      required: true,
    },

    emi_amount: {
      type: Number,
      min: 0,
    },

    tenure_month: {
      type: Number,
      min: 1,
    },

    payment_made: {
      type: Number,
      default: 0,
      min: 0,
    },

    payment_remaining: {
      type: Number,
      min: 0,
    },

    emi_date: {
      type: Number,
      min: 1,
      max: 31,
    },
  },
  { _id: false },
);

const InterestRateDetailsSchema = new Schema(
  {
    rate_pa: {
      type: Number,
      min: 0,
    },

    rate_type: {
      type: String,
      enum: ["simple", "variable"],
    },
  },
  { _id: false },
);

/* =================================================
   Main Loan Schema
================================================== */

const loanSchema = new Schema(
  {
    lender_id: {
      type: Schema.Types.ObjectId,
      ref: "Lent",
      required: true,
      index: true,
    },

    loan_type: {
      type: String,
      required: true,
      trim: true,
    },

    loan_status: {
      type: String,
      enum: ["active", "closed"],
      required: true,
      default: "active",
    },

    distribution_date: {
      type: Date,
      required: true,
    },

    loan_amount_details: {
      type: LoanAmountDetailsSchema,
      required: true,
    },

    repayment_details: {
      type: RepaymentDetailsSchema,
      required: true,
    },

    interest_rate_details: {
      type: InterestRateDetailsSchema,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

/* =================================================
   Indexes
================================================== */

loanSchema.index({ lender_id: 1, loan_status: 1 });
loanSchema.index({ distribution_date: -1 });

/* =================================================
   Types + Model
================================================== */

type Loan = InferSchemaType<typeof loanSchema>;

export default model<Loan>("Loan", loanSchema);
