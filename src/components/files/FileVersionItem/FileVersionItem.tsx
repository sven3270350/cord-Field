import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, { FC } from 'react';
import { useDateTimeFormatter } from '../../Formatters';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  useFileActions,
} from '../FileActions';
import { fileIcon } from '../fileTypes';
import { FileVersionItem_FileVersion_Fragment } from './FileVersionItem.generated';

const useStyles = makeStyles(({ spacing, typography }) => ({
  iconContainer: {
    marginRight: spacing(2),
    minWidth: spacing(4),
  },
  icon: {
    fontSize: typography.h2.fontSize,
  },
  text: {
    cursor: 'pointer',
    marginRight: spacing(3),
  },
}));

interface FileVersionItemProps {
  version: FileVersionItem_FileVersion_Fragment;
  actions: FileAction[];
}

export const FileVersionItem: FC<FileVersionItemProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateTimeFormatter();
  const { openFilePreview } = useFileActions();
  const { version, actions } = props;

  /**
   * Consumers of the `FileActionsContext` are going to pass in a list
   * of actions that are permitted to the user for this `fileNode`.
   * Regardless of what's passed in, we do not at this time ever want to
   * allow for new versions of Versions or for viewing the history of a
   * Version.
   */
  const menuActions = actions.filter(
    (action) =>
      action !== FileAction.History && action !== FileAction.NewVersion
  );

  const { createdAt, createdBy, name } = version;
  const Icon = fileIcon(version.mimeType);
  const createdByUser = createdBy.fullName;

  return (
    <ListItem>
      <ListItemIcon className={classes.iconContainer}>
        <Icon className={classes.icon} />
      </ListItemIcon>
      <ListItemText
        onClick={() => openFilePreview(version)}
        className={classes.text}
        primary={name}
        secondary={`Created on ${formatDate(createdAt)}${
          createdByUser ? ` by ${createdByUser}` : ''
        }`}
      />
      <ListItemSecondaryAction>
        <ActionsMenu item={version} actions={menuActions} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};
