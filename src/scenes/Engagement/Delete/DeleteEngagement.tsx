import { useMutation } from '@apollo/client';
import { Tooltip, Typography } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import * as React from 'react';
import { removeItemFromList } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { IconButton, IconButtonProps } from '../../../components/IconButton';
import { useNavigate } from '../../../components/Routing';
import { callAll } from '../../../util';
import { recalculateSensitivity } from '../LanguageEngagement/Create/recalculateSensitivity';
import {
  DeleteEngagementDocument,
  EngagementToDeleteFragment,
} from './DeleteEngagement.generated';

interface DeleteEngagementProps extends IconButtonProps {
  project: {
    __typename?: 'InternshipProject' | 'TranslationProject';
    id: string;
  };
  engagement: EngagementToDeleteFragment;
}

export const DeleteEngagement = (props: DeleteEngagementProps) => {
  const { project, engagement, ...rest } = props;
  const [deleteEng] = useMutation(DeleteEngagementDocument, {
    variables: {
      id: engagement.id,
    },
    update: callAll(
      removeItemFromList({
        listId: [project, 'engagements'],
        item: engagement,
      }),
      removeItemFromList({
        listId: 'engagements',
        item: engagement,
      }),
      recalculateSensitivity(project)
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!engagement.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Engagement">
        <IconButton color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() => deleteEng().then(() => navigate('../..'))}
        sendIfClean
        title="Delete Engagement"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this engagement?
        </Typography>
      </DialogForm>
    </>
  );
};