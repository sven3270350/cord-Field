import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { CreateDirectoryInput, GQLOperations } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { ButtonLink } from '../../../components/Routing';
import { useCreateProjectDirectoryMutation } from './CreateProjectFile.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type CreateProjectDirectoryProps = DialogFormProps<CreateDirectoryInput>;

export const CreateProjectDirectory = (
  props: Except<CreateProjectDirectoryProps, 'onSubmit'>
) => {
  const [createDirectory] = useCreateProjectDirectoryMutation();
  const {
    project,
    directoryId,
    loading,
    canRead,
  } = useProjectCurrentDirectory();
  const { enqueueSnackbar } = useSnackbar();

  if (canRead === false) {
    enqueueSnackbar(
      `You don't have permission to add folders in this project`,
      {
        preventDuplicate: true,
        variant: 'error',
        autoHideDuration: 3000,
      }
    );
  }

  const onSubmit: CreateProjectDirectoryProps['onSubmit'] = async (
    nameInput
  ) => {
    const input = {
      ...nameInput,
      parentId: directoryId,
    };
    const { data } = await createDirectory({
      variables: { input },
      refetchQueries: [GQLOperations.Query.ProjectDirectory],
    });
    const directory = data!.createDirectory;

    enqueueSnackbar(`Created folder: ${directory.name}`, {
      variant: 'success',
      action: () => (
        <ButtonLink
          color="inherit"
          to={`/projects/${project!.id}/files/${directory.id}`}
        >
          View
        </ButtonLink>
      ),
    });
  };

  return (
    <DialogForm {...props} onSubmit={onSubmit} title="Create Folder">
      <SubmitError />
      <TextField
        name="name"
        label="Name"
        placeholder="Enter folder name"
        required
      />
    </DialogForm>
  );
};
