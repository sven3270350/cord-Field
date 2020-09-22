import { Grid } from '@material-ui/core';
import * as React from 'react';
import {
  displayStatus,
  ProjectStatus,
  ProjectStatusList,
  Sensitivity,
  SensitivityList,
} from '../../../api';
import { CheckboxesField, CheckboxOption } from '../../../components/form';
import { SwitchField } from '../../../components/form/SwitchField';
import { BooleanParam, EnumListParam, makeQueryHandler } from '../../../hooks';

export const useProjectFilters = makeQueryHandler({
  status: EnumListParam<ProjectStatus>(),
  sensitivity: EnumListParam<Sensitivity>(),
  onlyMultipleEngagements: BooleanParam(),
});

export const ProjectFilterOptions = () => {
  return (
    <>
      <CheckboxesField name="status" label="Status" row>
        <Grid container>
          <Grid item xs={6}>
            <CheckboxOption label="Show All" default />
          </Grid>
          {ProjectStatusList.map((status) => (
            <Grid item xs={6} key={status}>
              <CheckboxOption
                key={status}
                label={displayStatus(status)}
                value={status}
              />
            </Grid>
          ))}
        </Grid>
      </CheckboxesField>
      <CheckboxesField name="sensitivity" label="Sensitivity" row>
        <Grid container>
          <Grid item xs={6}>
            <CheckboxOption label="Show All" default />
          </Grid>
          {SensitivityList.map((sensitivity) => (
            <Grid item xs={6} key={sensitivity}>
              <CheckboxOption label={sensitivity} value={sensitivity} />
            </Grid>
          ))}
        </Grid>
      </CheckboxesField>
      <SwitchField
        name="onlyMultipleEngagements"
        label="Only Show Cluster/Cohort Projects"
      />
    </>
  );
};
