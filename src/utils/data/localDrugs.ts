import { DrugHit } from "../types/drugHit";

// Minimal fields we actually care about for a locally-added drug.
// Everything else on DrugHit is filled with empty defaults by `toDrugHit`.
export interface LocalDrugInput {
  scientificName: string; // active ingredient -> "Scientific Name"
  tradeName: string; // -> "Trade Name"
  strength?: string;
  strengthUnit?: string;
  pharmaceuticalForm?: string;
  administrationRoute?: string;
  registerNumber?: string; // any unique id; defaults to LOCAL-<n>
}

// Build a full DrugHit (same shape Algolia returns) from minimal input so the
// rest of the prescription flow (DrugModal auto-fill, type guards) works as-is.
const toDrugHit = (input: LocalDrugInput, index: number): DrugHit => {
  const register = input.registerNumber ?? `LOCAL-${index + 1}`;
  return {
    objectID: `local-${register}`,
    RegisterNumber: register,
    OldRegisterNumber: "",
    ProductType: "",
    DrugType: "",
    SubType: "",
    "Scientific Name": input.scientificName,
    "Trade Name": input.tradeName,
    Strength: input.strength ?? "",
    StrengthUnit: input.strengthUnit ?? "",
    PharmaceuticalForm: input.pharmaceuticalForm ?? "",
    AdministrationRoute: input.administrationRoute ?? "",
    AtcCode1: "",
    AtcCode2: "",
    Size: "",
    SizeUnit: "",
    PackageTypes: "",
    PackageSize: "",
    LegalStatus: "",
    ProductControl: "",
    DistributeArea: "",
    PublicPrice: "",
    ShelfLife: "",
    StorageConditions: "",
    StorageConditionArabic: "",
    MarketingCompany: "",
    MarketingCountry: "",
    ManufactureName: "",
    ManufactureCountry: "",
    SecondaryPackageManufacture: "",
    MainAgent: "",
    SecondAgent: "",
    ThirdAgent: "",
    DescriptionCode: "",
    AuthorizationStatus: "",
  };
};

// 👇 Add extra drugs here. They always appear in the drug search menu, merged
// on top of the Algolia results, without touching the Algolia index.
const localDrugInputs: LocalDrugInput[] = [
  {
    scientificName: "Minoxidil + Finasteride",
    tradeName: "Minoxidil 5% + Finasteride 0.5% Spray",
    strength: "5% + 0.5%",
    // Concentration lives in `strength`; the dose is measured in ml (per doctor).
    strengthUnit: "ml",
    pharmaceuticalForm: "Spray",
    administrationRoute: "topical",
  },
  {
    scientificName: "Minoxidil + Dutasteride",
    tradeName: "Minoxidil 5% + Dutasteride 0.2% Solution",
    strength: "5% + 0.2%",
    // Dose measured in ml (per doctor).
    strengthUnit: "ml",
    pharmaceuticalForm: "Solution",
    administrationRoute: "topical",
  },
  {
    scientificName: "Minoxidil",
    tradeName: "Minoxidil 2.5mg Tablet",
    strength: "2.5",
    strengthUnit: "mg",
    pharmaceuticalForm: "Tablet",
    administrationRoute: "oral",
  },
  {
    scientificName: "Minoxidil",
    tradeName: "Minoxidil 5mg Tablet",
    strength: "5",
    strengthUnit: "mg",
    pharmaceuticalForm: "Tablet",
    administrationRoute: "oral",
  },
];

export const localDrugs: DrugHit[] = localDrugInputs.map(toDrugHit);

// Case-insensitive filter used to merge local drugs into the search menu.
// Empty query returns all of them (autocomplete opens on focus).
export const searchLocalDrugs = (query: string): DrugHit[] => {
  const q = query.trim().toLowerCase();
  if (!q) return localDrugs;
  return localDrugs.filter(
    (drug) =>
      drug["Scientific Name"].toLowerCase().includes(q) ||
      drug["Trade Name"].toLowerCase().includes(q)
  );
};
