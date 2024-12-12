export class MarketerOrganization {
  constructor(
    public id: number,
    public iban: string | null,
    public name: string,
    public city: string,
    public type: string,
    public numberOfBranches: number
  ) {}
}
