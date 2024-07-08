// models/SickLeave.ts
import { Consultation } from './consultation';

export class SickLeave {
  constructor(
    public id: number,
    public consultation: Consultation,
    public startDate: Date,
    public endDate: Date
  ) {}
}
