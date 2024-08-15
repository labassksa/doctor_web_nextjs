import { BaseItem } from "@algolia/autocomplete-core";
// Define the DiagnosisHit interface for Algolia search results
export interface DiagnosisHit extends BaseItem {
  Level: number;
  code_id: string;
  ascii_desc: string;
  ascii_short_desc: string;
  effective_from: string;
  objectID: string;
  [key: string]: any; // Index signature to handle any additional fields
}
