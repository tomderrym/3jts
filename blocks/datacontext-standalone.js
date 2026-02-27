
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
/* tslint:disable */

import {Example} from '@/lib/types';
import {type Dispatch, type SetStateAction, createContext} from 'react';

export interface Data {
  examples: Example[];
  setExamples: Dispatch<SetStateAction<Example[]>>;
  defaultExample: Example;
  isLoading: boolean;
}

export default function DataContext = createContext<Data>(null);
