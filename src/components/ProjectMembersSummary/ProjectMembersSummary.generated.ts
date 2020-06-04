/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';
import { ProjectMemberItemFragment } from './ProjectMemberItem.generated';
import { ProjectMemberItemFragmentDoc } from './ProjectMemberItem.generated';

export type ProjectMemberListFragment = {
  __typename?: 'SecuredProjectMemberList';
} & Pick<Types.SecuredProjectMemberList, 'total'> & {
    items: Array<{ __typename?: 'ProjectMember' } & ProjectMemberItemFragment>;
  };

export const ProjectMemberListFragmentDoc = gql`
  fragment ProjectMemberList on SecuredProjectMemberList {
    total
    items {
      ...ProjectMemberItem
    }
  }
  ${ProjectMemberItemFragmentDoc}
`;
