export type LoanPayload = {
  lender_id: string;
  loan_type: string;
  loan_status: string;
  distribution_date: string;

  principal_sanction: string;
  total_amount_paid: string;
  principal_outstanding: string;
  interest_outstanding: string;
  total_outstanding: string;

  repayment_type: "emi" | "onetime";
  emi_amount?: string;
  tenure_month?: string;
  emi_date?: Number | null;

  rate_pa: string;
  rate_type: "simple" | "variable";

  purpose: string;
};

export function normalizeLoanPayload(payload: LoanPayload) {
  const toNumber = (val: any, fallback = 0) => {
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  return {
    lender_id: payload.lender_id,
    loan_type: payload.loan_type,
    loan_status: payload.loan_status,
    distribution_date: payload.distribution_date
      ? new Date(payload.distribution_date)
      : undefined,

    loan_amount_details: {
      principal_sanction: toNumber(payload.principal_sanction),
      total_amount_paid: toNumber(payload.total_amount_paid),
      principal_outstanding: toNumber(payload.principal_outstanding),
      interest_outstanding: toNumber(payload.interest_outstanding),
      total_outstanding: toNumber(payload.total_outstanding),
    },

    repayment_details: {
      repayment_type: payload.repayment_type?.toLowerCase() || "onetime",
      emi_amount:
        payload.repayment_type === "emi"
          ? toNumber(payload.emi_amount)
          : undefined,
      tenure_month:
        payload.repayment_type === "emi"
          ? toNumber(payload.tenure_month)
          : undefined,
      payment_made: toNumber(payload.total_amount_paid),
      payment_remaining:
        payload.repayment_type === "emi" && toNumber(payload.emi_amount) > 0
          ? toNumber(payload.total_outstanding)
          : 0,
      emi_date: payload.emi_date ? toNumber(payload.emi_date) : null,
    },

    interest_rate_details: {
      rate_pa: toNumber(payload.rate_pa),
      rate_type: payload.rate_type?.toLowerCase() || "simple",
    },

    purpose: payload.purpose,
  };
}
