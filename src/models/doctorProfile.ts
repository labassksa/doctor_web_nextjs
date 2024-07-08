// models/DoctorProfile.ts
import { Consultation } from './consultation';
import  User  from './user';

export class DoctorProfile {
  constructor(
    public id: number,
    public specialty: string,
    public medicalLicenseNumber: string,
    public user: User,
    public iban?: string,
    public consultations?: Consultation[]
  ) {}
}

