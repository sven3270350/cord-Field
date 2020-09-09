import { Decorator } from 'final-form';
import React, { FC, useMemo } from 'react';
import { Except } from 'type-fest';
import { GQLOperations, UpdatePartnershipInput } from '../../../api';
import { SubmitAction, SubmitButton } from '../../../components/form';
import {
  hasManagingType,
  PartnershipForm,
  PartnershipFormFragment,
  PartnershipFormProps,
} from '../PartnershipForm';
import {
  useDeletePartnershipMutation,
  useUpdatePartnershipMutation,
} from './EditPartnership.generated';

type EditPartnershipProps = Except<
  PartnershipFormProps<UpdatePartnershipInput>,
  'onSubmit' | 'initialValues'
> & {
  partnership: PartnershipFormFragment;
};

const clearFinancialReportingType: Decorator<UpdatePartnershipInput> = (
  form
) => {
  let prevValues: Partial<UpdatePartnershipInput> | undefined;
  return form.subscribe(
    ({ initialValues, values }) => {
      if (prevValues === undefined || prevValues !== initialValues) {
        prevValues = initialValues;
      }
      if (
        hasManagingType(prevValues.partnership?.types) &&
        !hasManagingType(values.partnership.types)
      ) {
        // @ts-expect-error types don't account for nesting
        form.change('partnership.financialReportingType', null);
      }
      prevValues = values;
    },
    {
      values: true,
      initialValues: true,
    }
  );
};

const decorators = [clearFinancialReportingType];

export const EditPartnership: FC<EditPartnershipProps> = (props) => {
  const [updatePartnership] = useUpdatePartnershipMutation();
  const [deletePartnership] = useDeletePartnershipMutation();
  const { partnership } = props;

  const initialValues = useMemo(
    () => ({
      partnership: {
        id: partnership.id,
        agreementStatus: partnership.agreementStatus.value ?? 'NotAttached',
        mouStatus: partnership.mouStatus.value ?? 'NotAttached',
        types: partnership.types.value,
        financialReportingType: partnership.financialReportingType.value,
      },
    }),
    [
      partnership.agreementStatus.value,
      partnership.financialReportingType.value,
      partnership.id,
      partnership.mouStatus.value,
      partnership.types.value,
    ]
  );

  return (
    <PartnershipForm<UpdatePartnershipInput & SubmitAction<'delete'>>
      {...props}
      onSubmit={async (input) => {
        const refetchQueries = [GQLOperations.Query.ProjectPartnerships];
        if (input.submitAction === 'delete') {
          await deletePartnership({
            variables: { input: input.partnership.id },
            refetchQueries,
          });
          return;
        }
        await updatePartnership({
          variables: { input },
          refetchQueries,
        });
      }}
      title={`Edit Partnership with ${partnership.organization.name.value}`}
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
        >
          Delete
        </SubmitButton>
      }
      initialValues={initialValues}
      decorators={decorators}
    />
  );
};
