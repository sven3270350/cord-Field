import { useMutation } from '@apollo/client';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreatePersonInput, GQLOperations } from '../../../api';
import { ButtonLink } from '../../../components/Routing';
import { updateListQueryItems } from '../../../util';
import { UserForm, UserFormProps } from '../UserForm';
import {
  CreatePersonDocument,
  CreatePersonMutation,
  NewUserFragmentDoc,
} from './CreateUser.generated';

export type CreateUserProps = Except<
  UserFormProps<
    CreatePersonInput,
    CreatePersonMutation['createPerson']['user']
  >,
  'prefix' | 'onSubmit'
>;

export const CreateUser = (props: CreateUserProps) => {
  const [createPerson] = useMutation(CreatePersonDocument);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <UserForm
      title="Create Person"
      onSuccess={(user) => {
        enqueueSnackbar(`Created person: ${user.fullName}`, {
          variant: 'success',
          action: () => (
            <ButtonLink color="inherit" to={`/users/${user.id}`}>
              View
            </ButtonLink>
          ),
        });
      }}
      {...props}
      prefix="person"
      onSubmit={async (input) => {
        const { data } = await createPerson({
          variables: { input },
          update(cache, { data }) {
            cache.modify({
              fields: {
                users(existingItemRefs, { readField }) {
                  updateListQueryItems({
                    cache,
                    existingItemRefs,
                    fragment: NewUserFragmentDoc as DocumentNode,
                    fragmentName: GQLOperations.Fragment.NewUser,
                    newItem: data?.createPerson.user,
                    readField,
                  });
                },
              },
            });
          },
        });
        return data!.createPerson.user;
      }}
    />
  );
};
