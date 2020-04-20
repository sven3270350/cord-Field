import { Card, CardContent } from '@material-ui/core';
import { Decorator, Mutator } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';
import { LoginInput } from '../../../api';
import {
  EmailField,
  PasswordField,
  SubmitButton,
  SubmitError,
} from '../../../components/form';

export type LoginFormProps = Pick<
  FormProps<LoginInput>,
  'onSubmit' | 'initialValues'
> & { className?: string };

export const LoginForm = ({ className, ...props }: LoginFormProps) => (
  <Form
    {...props}
    onSubmit={async (...args) => {
      const res = await props.onSubmit(...args);
      return res
        ? {
            ...res,
            // Add errors to fields so they show invalid
            email: ' ',
            password: ' ',
          }
        : undefined;
    }}
    decorators={[clearSubmitErrorsOnChange]}
    mutators={{ clearSubmitErrors }}
  >
    {({ handleSubmit }) => (
      <Card component="form" onSubmit={handleSubmit} className={className}>
        <CardContent>
          <SubmitError />
          <EmailField placeholder="Enter Email Address" />
          <PasswordField placeholder="Enter Password" />
          <SubmitButton />
        </CardContent>
      </Card>
    )}
  </Form>
);

// Since email and password are invalid as a pair we need to clear
// both errors from both fields when either of them change.
const clearSubmitErrorsOnChange: Decorator<LoginInput> = (form) =>
  form.subscribe(
    ({ dirtySinceLastSubmit }) => {
      if (dirtySinceLastSubmit) {
        form.mutators.clearSubmitErrors();
      }
    },
    { dirtySinceLastSubmit: true }
  );

const clearSubmitErrors: Mutator<LoginInput> = (args, state) => {
  state.formState = {
    ...state.formState,
    submitError: undefined,
    submitErrors: undefined,
  };
};
