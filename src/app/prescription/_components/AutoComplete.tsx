// import { autocomplete } from '@algolia/autocomplete-js';
// import React, { createElement, Fragment, useEffect, useRef } from 'react';
// import { createRoot, Root } from 'react-dom/client';

// import type { AutocompleteOptions } from '@algolia/autocomplete-js';
// import { searchClient } from '../../../lib/algoliaClient';

// export function Autocomplete<TItem extends Record<string, unknown>>(
//   options: Partial<AutocompleteOptions<TItem>> &
//     Pick<React.ComponentProps<'div'>, 'className'>
// ) {
//   const { className, ...props } = options;
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const panelRootRef = useRef<Root | null>(null);
//   const rootRef = useRef<HTMLElement | null>(null);

//   useEffect(() => {
//     if (!containerRef.current) {
//       return undefined;
//     }

//     const search = autocomplete({
//       container: containerRef.current,
//       renderer: { createElement, Fragment, render: () => {} },
//       getSources(query) {
//         return [
//           {
//             sourceId: 'products',
//             getItems({ query }) {
//               return getAlgoliaResults({
//                 searchClient,
//                 queries: [
//                   {
//                     indexName: 'instant_search',
//                     query,
//                     params: {
//                       hitsPerPage: 5,
//                     },
//                   },
//                 ],
//               });
//             },
//             // ...
//           },
//         ];
//       },
//       render({ children }, root) {
//         if (!panelRootRef.current || rootRef.current !== root) {
//           rootRef.current = root;

//           panelRootRef.current?.unmount();
//           panelRootRef.current = createRoot(root);
//         }

//         panelRootRef.current.render(children);
//       },
//       ...props,
//     });

//     return () => {
//       search.destroy();
//     };
//   }, [props]);

//   return <div ref={containerRef} className={className} />;
// }

// function getAlgoliaResults(arg0: { searchClient: any; queries: { indexName: string; query: string; params: { hitsPerPage: number; }; }[]; }): import("@algolia/autocomplete-shared").MaybePromise<TItem[] | TItem[][] | import("@algolia/autocomplete-preset-algolia").RequesterDescription<TItem>> {
//   throw new Error('Function not implemented.');
// }