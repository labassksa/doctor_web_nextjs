import { Consultation } from './consultation';
import User from './user';

export class DoctorProfile {
  id: number;
  specialty: string;
  medicalLicenseNumber: string;
  user: User;
  iban?: string;
  consultations?: Consultation[];

  constructor({ id, specialty, medicalLicenseNumber, user, iban = "", consultations = [] }: 
    { id: number; specialty: string; medicalLicenseNumber: string; user: User; iban?: string; consultations?: Consultation[] }) {
    this.id = id;
    this.specialty = specialty;
    this.medicalLicenseNumber = medicalLicenseNumber;
    this.user = user;
    this.iban = iban;
    this.consultations = consultations;
  }
}
