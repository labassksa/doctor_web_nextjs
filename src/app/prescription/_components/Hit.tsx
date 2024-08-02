// components/Hit.tsx
import { Highlight } from "react-instantsearch-hooks-web";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";

// Define the types for the props expected by the Hit component
interface HitProps {
  hit: DrugHit; // Use the custom DrugHit type
  onSelect: (item: DrugHit) => void; // Define the onSelect prop type
}
// types/DrugHit.ts

// Define the DrugHit interface for Algolia search results
interface DrugHit extends AlgoliaHit {
  objectID: string;
  code: string;
  description: string;
  form?: string;
  ingredients?: string;
  strength?: string;
}

export const Hit = ({ hit, onSelect }: HitProps) => {
  return (
    <article
      className="cursor-pointer p-2 hover:bg-gray-100"
      onClick={() => onSelect(hit)} // Call the onSelect function when the item is clicked
    >
      <div className="hit-ascii_desc">
        <Highlight attribute="Scientific Name" hit={hit} />
      </div>
      <div className="hit-ascii_short_desc">
        <Highlight attribute="Trade Name" hit={hit} />
      </div>
      <div className="hit-code_id">
        <Highlight attribute="code_id" hit={hit} />
      </div>
    </article>
  );
};
