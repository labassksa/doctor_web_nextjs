import { DoctorProfile } from "./doctorProfile";
import { MarketerProfile } from "./marketerProfile";
import { PatientProfile } from "./patientProfile";
import { Payment } from "./payment";
import { PromotionalCode } from "./promotionalCode"; // Make sure this matches the file name!

export enum ConsultationType {
  Quick = "quick",
  Psychiatric = "psychiatric",
  Specialized = "specialized",
}

export enum ConsultationStatus {
  Paid = "Paid",
  Open = "Open",
  Closed = "Closed",
  PendingPayment = "PendingPayment",
}

export class Consultation {
  constructor(
    public id: number,
    public createdAt: Date,
    public patientJoinedAT: Date | null,
    public doctorJoinedAT: Date | null,
    public paidAT: Date,
    public closedAt: Date,
    public status: ConsultationStatus,
    public type: ConsultationType,
    public patient: PatientProfile | null,
    public doctor?: DoctorProfile | null,
    public payment?: Payment,
    public promotionalCode?: PromotionalCode,
    public marketerProfile?: MarketerProfile,
    public hasPrescription: boolean = false,
    public hasSOAP: boolean = false,
    public labTestPDFUrls?: string[], // To store multiple URLs for lab test PDFs
    public labConsultationType?: string, // To store multiple URLs for lab test PDFs
    public hasSickLeave: boolean = false
  ) {}
}
