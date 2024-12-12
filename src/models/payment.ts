import { User } from "./user";
import { Consultation } from "./consultation";
import { PromotionalCode } from "./promotionalCode";

export class Payment {
  constructor(
    public id: number,
    public invoiceId: string | null,
    public invoiceValue: number,
    public displayCurrencyIso: string | null,
    public paymentStatus: string | null,
    public paymentMethod: string | null,
    public createdAt: Date,
    public updatedAt: Date | null,
    public user?: User, // Associated user
    public consultation?: Consultation, // Associated consultation
    public promotionalCode?: PromotionalCode // Associated promo code
  ) {}
}
