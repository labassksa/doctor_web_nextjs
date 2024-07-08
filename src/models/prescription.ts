// models/Prescription.ts
import { Consultation } from './consultation';

export class Prescription {
  constructor(
    public id: number,
    public consultation: Consultation,
    public drugName: string,
    public strength: string,
    public pharmaceuticalForm: string,
    public dose: string,
    public registrationNo: string,
    public route: string,
    public frequency: string,
    public duration: string,
    public durationUnit: string,
    public prn: boolean,
    public diagnoses: string[],
    public allergies: string[],
    public indications?: string,
    public doseUnit?: string,
    public activeIngredient?: string,
  ) {}
}
