interface MyFatoorahInitConfig {
  countryCode: string | null;
  sessionId: string | null;
  cardViewId: string;
  supportedNetworks: string;
}

interface MyFatoorahResponse {
  IsSuccess: boolean;
  Message: string | null;
  ValidationErrors: string | null;
  Data: {
    SessionId: string;
    CardBrand: string;
    CardIdentifier: string;
    CardToken: string | null;
  };
}

interface MyFatoorahSubmitResponse {
  sessionId: string;
  cardBrand: string;
  cardIdentifier: string;
}

// interface Window {
//   myFatoorah: {
//     init: (config: MyFatoorahInitConfig) => void;
//     submit: () => Promise<any>;
//   };
// }
type ExecutePaymentResponse = {
  IsSuccess: boolean;
  Message: string | null;
  ValidationErrors: string | null;
  Data: {
    InvoiceId: number;
    IsDirectPayment: boolean;
    PaymentURL: string;
    CustomerReference: string | null;
    UserDefinedField: string | null;
    RecurringId: string | null;
  };
};
