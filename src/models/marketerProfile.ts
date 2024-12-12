import { User } from "./user";
import { MarketerOrganization } from "./marketerOrganization";

export class MarketerProfile {
  constructor(
    public id: number,
    public iban: string | null,
    public nationality: string | null,
    public hasGotOffer: boolean,
    public promoterName: string | null,
    public organization?: MarketerOrganization, // Associated organization
    public user?: User // Associated user
  ) {}
}
