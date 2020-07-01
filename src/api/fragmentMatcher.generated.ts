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
      'SecuredBudget',
      'SecuredCeremony',
      'SecuredCountry',
      'SecuredDate',
      'SecuredDateTime',
      'SecuredDegree',
      'SecuredFile',
      'SecuredInt',
      'SecuredInternPosition',
      'SecuredLanguage',
      'SecuredLiteracyMaterialRange',
      'SecuredMethodologies',
      'SecuredOrganization',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipTypes',
      'SecuredProjectStep',
      'SecuredRange',
      'SecuredRegion',
      'SecuredRoles',
      'SecuredStoryRange',
      'SecuredString',
      'SecuredUser',
      'SecuredUserStatus',
      'SecuredZone',
    ],
    Engagement: ['InternshipEngagement', 'LanguageEngagement'],
    FileNode: ['Directory', 'File', 'FileVersion'],
    Location: ['Country', 'Region', 'Zone'],
    Place: ['Country', 'Region', 'Zone'],
    Project: ['InternshipProject', 'TranslationProject'],
    Readable: [
      'SecuredBoolean',
      'SecuredBudget',
      'SecuredCeremony',
      'SecuredCountry',
      'SecuredDate',
      'SecuredDateTime',
      'SecuredDegree',
      'SecuredEducationList',
      'SecuredEngagementList',
      'SecuredFile',
      'SecuredInt',
      'SecuredInternPosition',
      'SecuredLanguage',
      'SecuredLiteracyMaterialRange',
      'SecuredMethodologies',
      'SecuredOrganization',
      'SecuredOrganizationList',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipList',
      'SecuredPartnershipTypes',
      'SecuredProductList',
      'SecuredProjectMemberList',
      'SecuredProjectStep',
      'SecuredRange',
      'SecuredRegion',
      'SecuredRoles',
      'SecuredStoryRange',
      'SecuredString',
      'SecuredUnavailabilityList',
      'SecuredUser',
      'SecuredUserStatus',
      'SecuredZone',
    ],
    Resource: [
      'Budget',
      'BudgetRecord',
      'Ceremony',
      'Country',
      'Directory',
      'Education',
      'Favorite',
      'File',
      'FileVersion',
      'Film',
      'InternshipEngagement',
      'InternshipProject',
      'Language',
      'LanguageEngagement',
      'LiteracyMaterial',
      'Organization',
      'Partnership',
      'Product',
      'ProjectMember',
      'Range',
      'Region',
      'Story',
      'TranslationProject',
      'Unavailability',
      'User',
      'Zone',
    ],
    SearchResult: [
      'Organization',
      'Country',
      'Region',
      'Zone',
      'Language',
      'TranslationProject',
      'InternshipProject',
      'User',
    ],
  },
};

export default result;

export const possibleTypes = result.possibleTypes;
