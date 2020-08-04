/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as Apollo from '@apollo/client';
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type { PartnershipCardFragment } from '../../../components/PartnershipCard/PartnershipCard.generated';
import { PartnershipCardFragmentDoc } from '../../../components/PartnershipCard/PartnershipCard.generated';
import type {
  ProjectBreadcrumb_InternshipProject_Fragment,
  ProjectBreadcrumb_TranslationProject_Fragment,
} from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import { ProjectBreadcrumbFragmentDoc } from '../../../components/ProjectBreadcrumb/ProjectBreadcrumb.generated';
import type { EditPartnershipFragment } from '../Edit/EditPartnership.generated';
import { EditPartnershipFragmentDoc } from '../Edit/EditPartnership.generated';

export type ProjectPartnershipsQueryVariables = Types.Exact<{
  input: Types.Scalars['ID'];
}>;

export interface ProjectPartnershipsQuery {
  readonly project:
    | ({ readonly __typename?: 'TranslationProject' } & {
        readonly partnerships: {
          readonly __typename?: 'SecuredPartnershipList';
        } & Pick<Types.SecuredPartnershipList, 'canCreate' | 'total'> & {
            readonly items: ReadonlyArray<
              {
                readonly __typename?: 'Partnership';
              } & PartnershipCardFragment &
                EditPartnershipFragment
            >;
          };
      } & ProjectBreadcrumb_TranslationProject_Fragment)
    | ({ readonly __typename?: 'InternshipProject' } & {
        readonly partnerships: {
          readonly __typename?: 'SecuredPartnershipList';
        } & Pick<Types.SecuredPartnershipList, 'canCreate' | 'total'> & {
            readonly items: ReadonlyArray<
              {
                readonly __typename?: 'Partnership';
              } & PartnershipCardFragment &
                EditPartnershipFragment
            >;
          };
      } & ProjectBreadcrumb_InternshipProject_Fragment);
}

export const ProjectPartnershipsDocument = gql`
  query ProjectPartnerships($input: ID!) {
    project(id: $input) {
      ...ProjectBreadcrumb
      partnerships {
        canCreate
        total
        items {
          ...PartnershipCard
          ...EditPartnership
        }
      }
    }
  }
  ${ProjectBreadcrumbFragmentDoc}
  ${PartnershipCardFragmentDoc}
  ${EditPartnershipFragmentDoc}
`;

/**
 * __useProjectPartnershipsQuery__
 *
 * To run a query within a React component, call `useProjectPartnershipsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectPartnershipsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProjectPartnershipsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useProjectPartnershipsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >
) {
  return Apollo.useQuery<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >(ProjectPartnershipsDocument, baseOptions);
}
export function useProjectPartnershipsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >
) {
  return Apollo.useLazyQuery<
    ProjectPartnershipsQuery,
    ProjectPartnershipsQueryVariables
  >(ProjectPartnershipsDocument, baseOptions);
}
export type ProjectPartnershipsQueryHookResult = ReturnType<
  typeof useProjectPartnershipsQuery
>;
export type ProjectPartnershipsLazyQueryHookResult = ReturnType<
  typeof useProjectPartnershipsLazyQuery
>;
export type ProjectPartnershipsQueryResult = Apollo.QueryResult<
  ProjectPartnershipsQuery,
  ProjectPartnershipsQueryVariables
>;
