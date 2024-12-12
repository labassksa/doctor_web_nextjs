import { MarketerProfile } from "./marketerProfile";

export class PromotionalCode {
  constructor(
    public id: number,
    public code: string,
    public isActive: boolean,
    public discountPercentage: number,
    public marketerPercentage: number | null,
    public marketerOrganizationPercentage: number | null,
    public createdAt: Date,
    public usageCount: number,
    public isLabassOffer: boolean,
    public marketerProfile?: MarketerProfile // Associated marketer profile
  ) {}
}
