import { Card, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import { GQLOperations } from '../../api';
import { useUploadLanguageEngagementPnpMutation } from '../../scenes/Engagement/Files';
import { LanguageEngagementDetailFragment } from '../../scenes/Engagement/LanguageEngagement';
import {
  FileActionsPopup as ActionsMenu,
  useFileActions,
} from '../files/FileActions';
import { useDateFormatter } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { UploadCallback, useUpload } from '../Upload';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    cursor: 'pointer',
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(3),
  },
  fileInfo: {
    flex: 1,
    paddingLeft: spacing(4),
  },
  fileName: {
    marginBottom: spacing(1),
  },
  fileMeta: {
    color: palette.text.secondary,
  },
  actionsMenu: {
    alignSelf: 'flex-start',
    marginTop: spacing(-1.5),
  },
}));

export interface EngagementFileCardProps {
  engagement: LanguageEngagementDetailFragment;
}

const FileCardMeta: FC<{ loading: boolean; text: string }> = ({
  loading,
  text,
}) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
      color="initial"
      variant="caption"
      component="p"
    >
      {!loading ? text : <Skeleton />}
    </Typography>
  );
};

export const EngagementFileCard: FC<EngagementFileCardProps> = (props) => {
  const classes = useStyles();
  const { engagement } = props;
  const { id } = engagement;
  const file = engagement.pnp.value;
  const formatDate = useDateFormatter();
  const { openFilePreview } = useFileActions();
  const { addFilesToUploadQueue } = useUpload();
  const [uploadEngagementFile] = useUploadLanguageEngagementPnpMutation();

  const uploadFile = async (
    uploadId: Parameters<UploadCallback>[0],
    name: Parameters<UploadCallback>[1]
  ): Promise<void> => {
    await uploadEngagementFile({
      variables: { id, pnp: { uploadId, name } },
      refetchQueries: [GQLOperations.Query.Engagement],
    });
  };

  const handleVersionUpload = (files: File[]) => {
    const fileInputs = files.map((file) => ({
      file,
      fileName: file.name,
      callback: uploadFile,
    }));
    addFilesToUploadQueue(fileInputs);
  };

  const { modifiedAt, name, modifiedBy } = file ?? {
    modifiedAt: DateTime.local(),
    name: '',
    modifiedBy: {
      displayFirstName: { value: '' },
      displayLastName: { value: '' },
    },
  };
  const {
    displayFirstName: { value: firstName },
    displayLastName: { value: lastName },
  } = modifiedBy;

  return (
    <Card
      className={classes.root}
      onClick={() => file && openFilePreview(file)}
    >
      <HugeIcon icon={ReportIcon} loading={!file} />
      <div className={classes.fileInfo}>
        <Typography className={classes.fileName} color="initial" variant="h4">
          {file ? name : <Skeleton width="80%" />}
        </Typography>
        <FileCardMeta
          text={`Updated by ${firstName} ${lastName}`}
          loading={!file}
        />
        <FileCardMeta text={formatDate(modifiedAt)} loading={!file} />
      </div>
      <div className={classes.actionsMenu}>
        {file && (
          <ActionsMenu item={file} onVersionUpload={handleVersionUpload} />
        )}
      </div>
    </Card>
  );
};
