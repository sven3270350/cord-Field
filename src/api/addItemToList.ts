import type { MutationUpdaterFn } from '@apollo/client/core';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type { DefinitionNode, ExecutableDefinitionNode } from 'graphql';
import { orderBy } from 'lodash';
import { Except } from 'type-fest';
import { unwrapSecured } from '../api';
import type { Order } from '../api';
import {
  argsFromStoreFieldName,
  ListModifier,
  modifyList,
  ModifyListOptions,
} from './modifyList';

export interface SortablePaginatedListInput {
  sort?: string;
  order?: Order;
}
export interface ListArgs {
  input?: SortablePaginatedListInput;
}

/**
 * Use this on a mutation's update option to add the newly created item to an
 * existing cached list.
 *
 * @example
 * const [createFoo] = useMutation(CreateFooDoc, {
 *   update: addItemToList({
 *     // A gql query called `foos`
 *     listId: 'foos',
 *     // The item fragment used both the list and the mutation result.
 *     itemFragment: FooFragmentDoc,
 *     // Grabbing the newly created item from the output of the mutation
 *     outputToItem: (res) => res.createFoo.foo
 *   })
 * })
 *
 * @example
 * const [createMember] = useMutation(CreateMemberDoc, {
 *   update: addItemToList({
 *     // An existing object with a members list
 *     listId: [project, 'members'],
 *     itemFragment: MemberFragmentDoc,
 *     outputToItem: (res) => res.createMember.member
 *   })
 * })
 */
export const addItemToList = <
  OwningObj extends { id: string },
  Item extends { id: string },
  MutationOutput,
  Args = ListArgs
>({
  listId,
  filter,
  itemFragment,
  outputToItem,
}: Except<ModifyListOptions<OwningObj, Args>, 'cache' | 'modifier'> & {
  // The fragment representing the item's shape.
  // This should probably be used in both the list and the mutation.
  itemFragment: DocumentNode<Item, unknown>;
  // A function describing how to get to the item from the mutation's result
  outputToItem: (out: MutationOutput) => Item;
}): MutationUpdaterFn<MutationOutput> => (cache, { data }) => {
  if (!data) {
    return;
  }

  const newItem = outputToItem(data);

  const newItemRef = cache.writeFragment({
    data: newItem,
    fragment: itemFragment,
    // writeFragment wants the fragment name to use when the doc has
    // multiple. We can safely assume these are all sub-fragments being
    // referenced, and the first one is the one we want.
    fragmentName: getFirstExecutableName(itemFragment),
  });
  if (!newItemRef) {
    return;
  }

  const modifier: ListModifier = (existing, { readField, storeFieldName }) => {
    if (
      !existing ||
      existing.items.some((ref) => readField('id', ref) === newItem.id)
    ) {
      return existing;
    }

    let newList = [...existing.items, newItemRef];

    // Sort the new item appropriately given the list's sort/order params
    const args = argsFromStoreFieldName<ListArgs>(storeFieldName);
    if (args.input?.sort && args.input.order) {
      newList = orderBy(
        newList,
        (ref) => {
          const field = readField(args.input!.sort!, ref);
          const fieldVal = unwrapSecured(field);
          return fieldVal;
        },
        args.input.order.toLowerCase() as Lowercase<Order>
      );
    }

    return {
      ...existing,
      total: Number(existing.total) + 1,
      items: newList,
    };
  };

  modifyList({ cache, listId, modifier, filter });
};

const getFirstExecutableName = (document: DocumentNode<unknown, unknown>) => {
  const firstDef = document.definitions.find(isExecutableDef);
  return firstDef?.name?.value;
};

const isExecutableDef = (
  def: DefinitionNode
): def is ExecutableDefinitionNode =>
  def.kind === 'OperationDefinition' || def.kind === 'FragmentDefinition';
