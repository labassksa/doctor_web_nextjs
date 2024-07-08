// models/Consultation.ts
import { DoctorProfile } from "./doctorProfile";
import { PatientProfile } from "./patientProfile";

export enum ConsultationType {
  Quick = "Quick",
  Detailed = "Detailed",
}

export enum ConsultationStatus {
  PendingPayment = "PendingPayment",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export class Consultation {
  constructor(
    public id: number,
    public createdAt: Date,
    public status: ConsultationStatus,
    public type: ConsultationType,
    public patient: PatientProfile,
    public doctor?: DoctorProfile | null, // Allowing null here
    public hasPrescription: boolean = false,
    public hasSOAP: boolean = false,
    public hasSickLeave: boolean = false
  ) {}
}
