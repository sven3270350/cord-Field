import { useMutation } from '@apollo/client';
import { isEqual, noop } from 'lodash';
import { useMemo } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { UpdateCeremonyInput } from '~/api/schema.graphql';
import { DateField, FieldGroup } from '../../../../components/form';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from '../../CeremonyCard/CeremonyCard.graphql';
import { CeremonyPlanned } from '../../CeremonyCard/CeremonyPlanned';

export const CeremonyForm = ({
  ceremony,
}: {
  ceremony: CeremonyCardFragment;
}) => {
  const [updateCeremony] = useMutation(UpdateCeremonyDocument);

  const { id: ceremonyId, estimatedDate, actualDate } = ceremony.value || {};

  const initialValues = useMemo(
    () => ({
      ceremony: {
        id: ceremonyId || '',
        estimatedDate: estimatedDate?.value,
        actualDate: actualDate?.value,
      },
    }),
    [actualDate?.value, ceremonyId, estimatedDate?.value]
  );

  return (
    <>
      <CeremonyPlanned {...ceremony} flipped />
      <Form<UpdateCeremonyInput> initialValues={initialValues} onSubmit={noop}>
        {() => (
          <FieldGroup prefix="ceremony">
            <FormSpy<UpdateCeremonyInput>
              subscription={{ values: true }}
              onChange={({ values: input }) => {
                if (!isEqual(initialValues, input)) {
                  void updateCeremony({ variables: { input } });
                }
              }}
            />
            <DateField
              disabled={
                !ceremony.value?.planned.value ||
                !ceremony.value.estimatedDate.canEdit
              }
              name="estimatedDate"
              label="Planned Date"
            />
            <DateField
              name="actualDate"
              label="Actual Date"
              disabled={
                !ceremony.value?.planned.value ||
                !ceremony.value.actualDate.canEdit
              }
            />
          </FieldGroup>
        )}
      </Form>
    </>
  );
};
