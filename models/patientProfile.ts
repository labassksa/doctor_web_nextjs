// models/PatientProfile.ts
import User from "./user";
import { Consultation } from "./consultation";

export class PatientProfile {
  constructor(
    public id: number,
    public user: User,
    public consultations?: Consultation[]
  ) {}
}
