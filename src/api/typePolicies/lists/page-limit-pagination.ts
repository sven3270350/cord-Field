import {
  FieldFunctionOptions,
  FieldPolicy,
} from '@apollo/client/cache/inmemory/policies';
import { isObject } from 'lodash';

export interface PaginatedListInput {
  count?: number | null;
  page?: number | null;
}
export interface PaginatedListArgs {
  input?: PaginatedListInput;
}

export interface PaginatedListOutput<T> {
  hasMore: boolean;
  items: readonly T[];
  total: number;
}

/**
 * Opinionated pagination handling for our API lists.
 * This works for all lists that fit the in/put shapes above.
 *
 * All args besides page & count are treated as separate lists.
 *
 * Each page of the list is merged together into a sparse array.
 * This should allow pages to be fetched out of order while maintaining sanity.
 * i.e. resuming a list in the middle.
 *
 * Careful using `hasMore` property with this. That indicates the end of the list
 * has been reached but not necessarily that all pages have been fetched.
 *
 * If you only want an individual page at a time,
 * the read field can be specified like so:
 * ```
 * fieldFoo: {
 *   ...pageLimitPagination(),
 *   read: (existing) => { custom logic },
 * }
 * ```
 */
export const pageLimitPagination = <
  T,
  List extends Partial<PaginatedListOutput<T>>
>(): FieldPolicy<List> => ({
  // The list is unique for all args except page & count
  keyArgs: (args: PaginatedListArgs | null) => {
    const { count, page, ...rest } = args?.input ?? {};
    return objectToKeyArgs({ input: rest });
  },
  merge(existing, incoming, { args }: FieldFunctionOptions<PaginatedListArgs>) {
    // We are assuming these defaults if not given.
    const page = args?.input?.page ?? 1;
    const count = args?.input?.count ?? 25;

    const items = new Array(incoming.total);
    // forEach() is used here because it maintains the sparse array, while only
    // iterating on indexes that have a value.
    existing?.items?.forEach((item, i) => {
      items[i] = item;
    });
    incoming.items?.forEach((item, i) => {
      const adjustedIndex = (page - 1) * count + i;
      items[adjustedIndex] = item;
    });

    return {
      ...existing,
      ...incoming,
      items,
      // If we already believe to have finished paging, then keep that status
      // even though we've received another non-ending page somehow.
      hasMore: existing?.hasMore === false ? false : incoming.hasMore,
    };
  },
});

// Converts an object to a list of Apollo key specifiers
const objectToKeyArgs = (obj: Record<string, any>): KeySpecifier =>
  Object.entries(obj).reduce(
    (keyArgs: KeySpecifier, [key, val]) => [
      ...keyArgs,
      key,
      ...(isObject(val) ? [objectToKeyArgs(val)] : []),
    ],
    []
  );

type KeySpecifier = Array<string | any[]>;
