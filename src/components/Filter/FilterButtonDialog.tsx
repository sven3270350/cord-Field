import { Button } from '@material-ui/core';
import { isEqual } from 'lodash';
import { ReactNode } from 'react';
import * as React from 'react';
import { useDialog } from '../Dialog';
import { DialogForm } from '../Dialog/DialogForm';

export interface FilterButtonDialogProps<T> {
  values: Partial<T>;
  onChange: (val: Partial<T>) => void;
  children: ReactNode;
}

export function FilterButtonDialog<T>({
  values,
  onChange,
  children,
}: FilterButtonDialogProps<T>) {
  const [state, open] = useDialog();

  return (
    <>
      <Button variant="outlined" onClick={() => open()}>
        Filter Options
      </Button>

      <DialogForm
        DialogProps={{
          fullWidth: true,
          maxWidth: 'xs',
        }}
        {...state}
        title="Filter Options"
        closeLabel="Reset Filters"
        submitLabel="Apply Filters"
        initialValues={values}
        onSubmit={(newValues) => {
          if (!isEqual(values, newValues)) {
            onChange(newValues);
          }
          state.onClose();
        }}
        onClose={(reason, form) => {
          if (reason === 'cancel') {
            form.reset();
          }
          state.onClose();
        }}
      >
        {children}
      </DialogForm>
    </>
  );
}
