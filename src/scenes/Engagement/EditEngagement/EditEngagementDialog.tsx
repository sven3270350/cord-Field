import { makeStyles } from '@material-ui/core';
import { pick, startCase } from 'lodash';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  displayInternPosition,
  InternshipEngagementPosition,
  MethodologyToApproach,
  UpdateInternshipEngagementInput,
  UpdateLanguageEngagementInput,
} from '../../../api';
import { DisplayCountryFragment } from '../../../api/fragments/location.generated';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxField,
  CheckboxOption,
  DateField,
  FieldGroup,
  RadioField,
  RadioOption,
  SubmitError,
} from '../../../components/form';
import { CountryField, UserField } from '../../../components/form/Lookup';
import { UserLookupItemFragment } from '../../../components/form/Lookup/User/UserLookup.generated';
import { InternshipEngagementDetailFragment } from '../InternshipEngagement/InternshipEngagement.generated';
import { LanguageEngagementDetailFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import {
  useUpdateInternshipEngagementMutation,
  useUpdateLanguageEngagementMutation,
} from './EditEngagementDialog.generated';

type EditEngagementDialogProps = Except<
  DialogFormProps<
    UpdateInternshipEngagementInput | UpdateInternshipEngagementInput
  >,
  'onSubmit' | 'initialValues'
> & {
  engagement:
    | InternshipEngagementDetailFragment
    | LanguageEngagementDetailFragment;
  editValue?: string;
};

type DialogFormInput = UpdateInternshipEngagementInput &
  UpdateLanguageEngagementInput & {
    engagement: {
      mentor?: UserLookupItemFragment;
      country?: DisplayCountryFragment;
    };
  };

const internshipEngagementPositions: InternshipEngagementPosition[] = [
  'ExegeticalFacilitator',
  'TranslationConsultantInTraining',
  'AdministrativeSupportSpecialist',
  'BusinessSupportSpecialist',
  'CommunicationSpecialistInternal',
  'CommunicationSpecialistMarketing',
  'LanguageProgramManager',
  'LanguageProgramManagerOrFieldOperations',
  'LanguageSoftwareSupportSpecialist',
  'LeadershipDevelopment',
  'LiteracySpecialist',
  'LukePartnershipFacilitatorOrSpecialist',
  'MobilizerOrPartnershipSupportSpecialist',
  'OralFacilitatorOrSpecialist',
  'PersonnelOrHrSpecialist',
  'ScriptureUseSpecialist',
  'TechnicalSupportSpecialist',
  'TranslationFacilitator',
  'Translator',
];

const useStyles = makeStyles(() => ({
  dialog: {
    width: 400,
  },
}));

export const EditEngagementDialog: FC<EditEngagementDialogProps> = ({
  engagement,
  editValue,
  ...props
}) => {
  const classes = useStyles();
  const [updateInternshipEngagement] = useUpdateInternshipEngagementMutation();
  const [updateLanguageEngagement] = useUpdateLanguageEngagementMutation();

  const updateEngagement =
    engagement.__typename === 'InternshipEngagement'
      ? updateInternshipEngagement
      : updateLanguageEngagement;

  const fields =
    editValue &&
    (editValue === 'startEndDate' ? (
      <>
        <DateField name="startDate" label="Start Date" />
        <DateField name="endDate" label="End Date" />
      </>
    ) : editValue === 'completeDate' ? (
      <DateField
        name="completeDate"
        label={
          engagement.__typename === 'InternshipEngagement'
            ? 'Growth Plan Complete Date'
            : 'Translation Complete Date'
        }
      />
    ) : editValue === 'disbursementCompleteDate' ? (
      <DateField
        name="disbursementCompleteDate"
        label="Disbursement Complete Date"
      />
    ) : editValue === 'communicationsCompleteDate' ? (
      <DateField
        name="communicationsCompleteDate"
        label="Communications Complete Date"
      />
    ) : editValue === 'methodologies' ? (
      <>
        <CheckboxesField name="methodologies" label="Methodologies">
          {Object.keys(MethodologyToApproach).map((group) => (
            <CheckboxOption
              key={group}
              label={startCase(group)}
              value={group}
            />
          ))}
        </CheckboxesField>
      </>
    ) : editValue === 'position' ? (
      <RadioField name="position" label="Intern Position">
        {internshipEngagementPositions.map((position) => (
          <RadioOption
            key={position}
            label={displayInternPosition(position)}
            value={position}
          />
        ))}
      </RadioField>
    ) : editValue === 'countryOfOrigin' ? (
      <CountryField name="country" label="Country of Origin" />
    ) : editValue === 'mentor' ? (
      <UserField name="mentor" label="Mentor" />
    ) : editValue === 'firstScriptureAndLukePartnership' ? (
      <>
        <CheckboxField
          name="firstScripture"
          label="First Scripture"
          defaultValue={
            engagement.__typename === 'LanguageEngagement' &&
            Boolean(engagement.firstScripture.value)
          }
        />
        <CheckboxField
          name="lukePartnership"
          label="Luke Partnership"
          defaultValue={
            engagement.__typename === 'LanguageEngagement' &&
            Boolean(engagement.lukePartnership.value)
          }
        />
      </>
    ) : null);

  // Filter out relevant initial values so the other values don't get added to the mutation
  const sharedInitialValues = {
    startDate: engagement.startDate.value,
    endDate: engagement.endDate.value,
    completeDate: engagement.completeDate.value,
    disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    communicationsCompleteDate: engagement.communicationsCompleteDate.value,
  };

  const fullInitialValues =
    engagement.__typename === 'InternshipEngagement'
      ? {
          ...sharedInitialValues,
          methodologies: engagement.methodologies.value,
          position: engagement.position.value,
        }
      : sharedInitialValues;

  const pickKeys =
    editValue === 'startEndDate'
      ? ['id', 'startDate', 'endDate']
      : ['id', editValue || ''];

  const filteredInitialValues = {
    engagement: {
      id: engagement.id,
      ...pick(fullInitialValues, pickKeys),
    },
  };

  return (
    <DialogForm<DialogFormInput>
      title="Update Engagement"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={filteredInitialValues}
      onSubmit={async ({ engagement: { mentor, country, ...rest } }) => {
        const mentorId = mentor?.id;
        const countryOfOriginId = country?.id;
        const input = {
          engagement: {
            ...rest,
            ...(mentorId ? { mentorId } : {}),
            ...(countryOfOriginId ? { countryOfOriginId } : {}),
          },
        };

        await updateEngagement({ variables: { input } });
      }}
      DialogProps={{
        classes: {
          paper: classes.dialog,
        },
      }}
    >
      <SubmitError />
      <FieldGroup prefix="engagement">{fields}</FieldGroup>
    </DialogForm>
  );
};