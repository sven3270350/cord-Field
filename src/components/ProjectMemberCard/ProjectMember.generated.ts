/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../api/schema.generated';

export type ProjectMemberCardFragment = { __typename?: 'ProjectMember' } & Pick<
  Types.ProjectMember,
  'id' | 'createdAt'
> & {
    user: { __typename?: 'SecuredUser' } & {
      value?: Types.Maybe<
        { __typename?: 'User' } & Pick<Types.User, 'fullName' | 'avatarLetters'>
      >;
    };
    roles: { __typename?: 'SecuredRoles' } & Pick<
      Types.SecuredRoles,
      'value' | 'canRead'
    >;
  };

export const ProjectMemberCardFragmentDoc = gql`
  fragment ProjectMemberCard on ProjectMember {
    id
    createdAt
    user {
      value {
        fullName
        avatarLetters
      }
    }
    roles {
      value
      canRead
    }
  }
`;
