import { BaseItem } from "@algolia/autocomplete-core";

// Define the DrugHit interface for Algolia search results
export interface DrugHit extends BaseItem {
  objectID: string;
  RegisterNumber: string;
  OldRegisterNumber: string;
  ProductType: string;
  DrugType: string;
  SubType: string;
  "Scientific Name": string; // Property with space
  "Trade Name": string;
  Strength: string;
  StrengthUnit: string;
  PharmaceuticalForm: string;
  AdministrationRoute: string;
  AtcCode1: string;
  AtcCode2: string;
  Size: string;
  SizeUnit: string;
  PackageTypes: string;
  PackageSize: string;
  LegalStatus: string;
  ProductControl: string;
  DistributeArea: string;
  PublicPrice: string;
  ShelfLife: string;
  StorageConditions: string;
  StorageConditionArabic: string;
  MarketingCompany: string;
  MarketingCountry: string;
  ManufactureName: string;
  ManufactureCountry: string;
  SecondaryPackageManufacture: string;
  MainAgent: string;
  SecondAgent: string;
  ThirdAgent: string;
  DescriptionCode: string;
  AuthorizationStatus: string;
  [key: string]: any; // Index signature to handle any additional fields
}
