export enum ConsultationStatus {
  Paid = "Paid",
  Open = "Open",
  Closed = "Closed",
  PendingPayment = "PendingPayment",
  Failed = "Failed",
}

export enum ConsultationEvents {
  PAYMENT_SUCCESSFUL = "PAYMENT_SUCCESSFUL",
  DOCTOR_ACCEPTED = "DOCTOR_ACCEPTED",
  PATIENT_JOINS = "PATIENT_JOINS",
  END_CONSULTATION = "END_CONSULTATION",
}
