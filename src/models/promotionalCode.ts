import { MarketerProfile } from "./marketerProfile";

interface PromoCodeUser {
  createdAt: Date;
  id: number;
  phoneNumber?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  gender?: string | null;
  nationalId?: string | null;
  dateOfBirth?: string | null;
  registrationToken?: string | null;
  role: string[];
}

export class PromotionalCode {
  constructor(
    public id: number,
    public code: string,
    public isActive: boolean,
    public isUsed: boolean, // Add this field
    public isFree: boolean, // Add this field
    public type: string, // Add this field (e.g. "single-use")
    // discountPercentage might be returned as a string; convert as needed.
    public discountPercentage: number,
    public marketerPercentage: number | null,
    public marketerOrganizationPercentage: number | null,
    public createdAt: Date,
    public usageCount: number,
    public isLabassOffer: boolean,
    public packageType: string | null, // Add this field if needed
    public marketerProfile?: MarketerProfile,
    public user?: PromoCodeUser // Add this field for the associated user
  ) {}
}
