import { ToggleButton } from '@material-ui/lab';
import React from 'react';
import { displayProgressMeasurement } from '../../../api';
import { ProgressMeasurement } from '../../../api/schema.graphql';
import { EnumField } from '../../../components/form';
import { SectionProps } from './ProductFormFields';
import { SecuredAccordion } from './SecuredAccordion';

const measurementOptions: ProgressMeasurement[] = [
  'Percent',
  'Number',
  'Boolean',
];

export const ProgressMeasurementSection = ({
  values,
  accordionState,
}: SectionProps) => {
  const { progressStepMeasurement, productType } = values.product ?? {};

  if (productType !== 'Other') {
    return null;
  }

  return (
    <SecuredAccordion
      {...accordionState}
      name="progressStepMeasurement"
      title="Progress Measurement"
      renderCollapsed={() =>
        progressStepMeasurement && (
          <ToggleButton selected value={progressStepMeasurement}>
            {displayProgressMeasurement(progressStepMeasurement)}
          </ToggleButton>
        )
      }
    >
      {(props) => (
        <EnumField
          required
          options={measurementOptions}
          getLabel={displayProgressMeasurement}
          variant="toggle-split"
          {...props}
        />
      )}
    </SecuredAccordion>
  );
};
