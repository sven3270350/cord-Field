import React, { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdateLanguage } from '../../../api';
import { CalendarDate, Nullable } from '../../../util';
import { LanguageForm, LanguageFormProps } from '../LanguageForm';
import { useUpdateLanguageMutation } from './EditLanguage.generated';

interface LanguageFormValues {
  language: Except<UpdateLanguage, 'sponsorEstimatedEndDate'> & {
    sponsorEstimatedEndFY?: Nullable<number>;
  };
}
export type EditLanguageProps = Except<
  LanguageFormProps<LanguageFormValues>,
  'onSubmit' | 'initialValues'
>;

export const EditLanguage = (props: EditLanguageProps) => {
  const [updateLanguage] = useUpdateLanguageMutation();
  const language = props.language;

  const initialValues = useMemo(
    () =>
      language
        ? {
            language: {
              id: language.id,
              name: language.name.value,
              displayName: language.displayName.value,
              displayNamePronunciation: language.displayNamePronunciation.value,
              isDialect: language.isDialect.value,
              ethnologue: {
                code: language.ethnologue.code.value,
                provisionalCode: language.ethnologue.provisionalCode.value,
                name: language.ethnologue.name.value,
                population: language.ethnologue.population.value,
              },
              populationOverride: language.populationOverride.value,
              registryOfDialectsCode: language.registryOfDialectsCode.value,
              leastOfThese: language.leastOfThese.value,
              leastOfTheseReason: language.leastOfTheseReason.value,
              isSignLanguage: language.isSignLanguage.value,
              sensitivity: language.sensitivity,
              sponsorEstimatedEndFY:
                language.sponsorEstimatedEndDate.value &&
                CalendarDate.toFiscalYear(
                  language.sponsorEstimatedEndDate.value
                ),
            },
          }
        : undefined,
    [language]
  );

  return (
    <LanguageForm<LanguageFormValues>
      title="Edit Language"
      {...props}
      initialValues={initialValues}
      onSubmit={async ({
        language: { populationOverride, sponsorEstimatedEndFY, ...rest },
      }) => {
        await updateLanguage({
          variables: {
            input: {
              language: {
                populationOverride: populationOverride ?? null,
                sponsorEstimatedEndDate: CalendarDate.fiscalYearEndToCalendarDate(
                  sponsorEstimatedEndFY
                ),
                ...rest,
              },
            },
          },
        });
      }}
    />
  );
};
