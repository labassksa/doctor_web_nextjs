import User from "./user";
import { Consultation } from "./consultation";

export class PatientProfile {
  id: number;
  user: User;
  consultations?: Consultation[];

  constructor({ id, user, consultations = [] }: { id: number; user: User; consultations?: Consultation[] }) {
    this.id = id;
    this.user = user;
    this.consultations = consultations;
  }
}
