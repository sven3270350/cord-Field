import {
  Avatar,
  Card,
  CardActionArea,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  NotInterested as NotPermittedIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC, ReactNode, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { SecuredProp } from '../../api';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  getPermittedFileActions,
  useFileActions,
} from '../files/FileActions';
import { FileNodeInfo_File_Fragment as FileNode } from '../files/files.generated';
import { FormattedDateTime } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { Redacted } from '../Redacted';
import { DropzoneOverlay } from '../Upload';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  root: {
    position: 'relative',
  },
  addActionArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: spacing(3, 4),
  },
  editActionArea: {
    cursor: 'pointer',
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(3, 4),
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#f3f4f6',
    width: 58,
    height: 58,
  },
  dropzoneText: {
    fontSize: typography.h2.fontSize,
  },
  icon: {
    color: 'white',
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
    margin: spacing(1),
    position: 'absolute',
    right: 0,
    top: 0,
  },
  text: {
    marginTop: spacing(1),
    textTransform: 'none',
  },
}));

export interface DefinedFileCardProps {
  title: ReactNode;
  resourceType: string;
  securedFile: SecuredProp<FileNode>;
  onVersionUpload: (files: File[]) => void;
}

interface FileCardMetaProps {
  canRead: boolean;
  loading: boolean;
  resourceType: DefinedFileCardProps['resourceType'];
  text: ReactNode;
}

const FileCardMeta: FC<FileCardMetaProps> = ({
  canRead,
  loading,
  resourceType,
  text,
}) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
      color="initial"
      variant="caption"
      component="p"
      gutterBottom
    >
      {loading ? (
        <Skeleton />
      ) : !canRead ? (
        <Redacted
          info={`You do not have permission to view files for this ${resourceType}`}
        />
      ) : (
        text
      )}
    </Typography>
  );
};

export const DefinedFileCard = (props: DefinedFileCardProps) => {
  const classes = useStyles();
  const { title, onVersionUpload, resourceType, securedFile } = props;
  const { value: file, canRead, canEdit } = securedFile;

  const { openFilePreview } = useFileActions();

  const standardFileActions = useMemo(
    () => getPermittedFileActions(canRead, canEdit),
    [canEdit, canRead]
  );
  // Defined Files seem like they'll probably always have fixed names
  const noRenameFileActions = useMemo(
    () => standardFileActions.filter((action) => action !== FileAction.Rename),
    [standardFileActions]
  );
  const permittedFileActions = useMemo(
    () => ({
      // We only want to allow deletion of Defined File `Versions`,
      // not the files themselves.
      file: noRenameFileActions.filter(
        (action) => action !== FileAction.Delete
      ),
      version: noRenameFileActions,
    }),
    [noRenameFileActions]
  );

  const isCardDisabled = useMemo(
    () => (file && !canRead) || (!file && !canEdit),
    [canEdit, canRead, file]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onVersionUpload,
    disabled: isCardDisabled,
    multiple: false,
    noClick: !!file,
    noKeyboard: !!file,
  });

  const { modifiedAt, name, modifiedBy } = file ?? {
    modifiedAt: DateTime.local(),
    name: '',
    modifiedBy: {
      fullName: '',
    },
  };

  const { fullName } = modifiedBy;

  const Icon = useMemo(() => (!file && canEdit ? AddIcon : NotPermittedIcon), [
    canEdit,
    file,
  ]);

  const card = useMemo(
    () => (
      <Card {...getRootProps()} className={classes.root}>
        <input {...getInputProps()} name="defined_file_version_uploader" />
        <DropzoneOverlay
          classes={{ text: classes.dropzoneText }}
          isDragActive={isDragActive}
          message={!file ? `Add ${title} file` : 'Drop new version to upload'}
        />
        <CardActionArea
          className={!file ? classes.addActionArea : classes.editActionArea}
          disabled={isCardDisabled}
          onClick={() => file && openFilePreview(file)}
        >
          {!file ? (
            <>
              <Avatar classes={{ root: classes.avatar }}>
                <Icon className={classes.icon} fontSize="large" />
              </Avatar>
              <Typography variant="button" className={classes.text}>
                Add {title}
              </Typography>
            </>
          ) : (
            <>
              <HugeIcon icon={ReportIcon} loading={!file} />
              <div className={classes.fileInfo}>
                <Typography
                  className={classes.fileName}
                  color="initial"
                  variant="h4"
                >
                  {title}
                </Typography>
                <FileCardMeta
                  canRead={canRead}
                  loading={!file}
                  resourceType={resourceType}
                  text={name}
                />
                <FileCardMeta
                  canRead={canRead}
                  loading={!file}
                  resourceType={resourceType}
                  text={
                    <>
                      Updated by {fullName} at{' '}
                      <FormattedDateTime date={modifiedAt} />
                    </>
                  }
                />
              </div>
            </>
          )}
        </CardActionArea>
        {file && canRead && (
          <div className={classes.actionsMenu}>
            <ActionsMenu
              actions={permittedFileActions}
              item={file}
              onVersionUpload={onVersionUpload}
            />
          </div>
        )}
      </Card>
    ),
    [
      Icon,
      canRead,
      classes,
      file,
      fullName,
      getInputProps,
      getRootProps,
      isCardDisabled,
      isDragActive,
      modifiedAt,
      name,
      onVersionUpload,
      openFilePreview,
      permittedFileActions,
      resourceType,
      title,
    ]
  );

  return !file && !canEdit ? (
    <Tooltip title={`You do not have permission to add this ${title}`}>
      {card}
    </Tooltip>
  ) : (
    card
  );
};
