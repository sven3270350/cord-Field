/* eslint-disable import/no-default-export */

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}

const result: PossibleTypesResultData = {
  possibleTypes: {
    Editable: [
      'SecuredBoolean',
      'SecuredCeremony',
      'SecuredCountry',
      'SecuredDate',
      'SecuredDateTime',
      'SecuredDegree',
      'SecuredInt',
      'SecuredInternPosition',
      'SecuredLanguage',
      'SecuredMethodologies',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipTypes',
      'SecuredProjectStep',
      'SecuredRegion',
      'SecuredRoles',
      'SecuredString',
      'SecuredUser',
      'SecuredZone',
    ],
    Engagement: ['InternshipEngagement', 'LanguageEngagement'],
    FileNode: ['Directory', 'File'],
    FileOrDirectory: ['File', 'Directory'],
    Location: ['Country', 'Region', 'Zone'],
    Place: ['Country', 'Region', 'Zone'],
    Project: ['InternshipProject', 'TranslationProject'],
    Readable: [
      'SecuredBoolean',
      'SecuredCeremony',
      'SecuredCountry',
      'SecuredDate',
      'SecuredDateTime',
      'SecuredDegree',
      'SecuredEducationList',
      'SecuredInt',
      'SecuredInternPosition',
      'SecuredInternshipEngagementList',
      'SecuredLanguage',
      'SecuredLanguageEngagementList',
      'SecuredMethodologies',
      'SecuredOrganizationList',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipTypes',
      'SecuredProductList',
      'SecuredProjectMemberList',
      'SecuredProjectStep',
      'SecuredRegion',
      'SecuredRoles',
      'SecuredString',
      'SecuredUnavailabilityList',
      'SecuredUser',
      'SecuredZone',
    ],
    Resource: [
      'Budget',
      'BudgetRecord',
      'Ceremony',
      'Country',
      'Directory',
      'Education',
      'File',
      'FileVersion',
      'InternshipEngagement',
      'InternshipProject',
      'Language',
      'LanguageEngagement',
      'Organization',
      'Partnership',
      'Product',
      'ProjectMember',
      'Region',
      'TranslationProject',
      'Unavailability',
      'User',
      'Zone',
    ],
  },
};

export default result;

export const possibleTypes = result.possibleTypes;