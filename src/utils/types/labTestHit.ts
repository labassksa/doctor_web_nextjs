import { BaseItem } from "@algolia/autocomplete-core";

export interface LabTestHit extends BaseItem {
    id: number;
    test_name: string;
    code: string;
    objectID: string;
    [key: string]: any; // Index signature to handle any additional fields
}
