// models/SOAP.ts
import { Consultation } from "./consultation";

export class SOAP {
  constructor(
    public id: number,
    public subjective: string,
    public objective: string,
    public assessment: string,
    public plan: string,
    public consultation: Consultation
  ) {}
}
