import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Divider,
  List,
} from '@material-ui/core';
import React, { FC, Fragment } from 'react';
import { File } from '../../../api';
import { DialogState } from '../../Dialog';
import {
  FileVersionItem,
  FileVersionItem_FileVersion_Fragment,
} from '../FileVersionItem';
import { useFileVersionsQuery } from './FileActions.generated';

type FileVersionsList = FileVersionItem_FileVersion_Fragment[];

type FileVersionsProps = DialogState & {
  file: File | undefined;
};

export const FileVersions: FC<FileVersionsProps> = (props) => {
  const { file, ...dialogProps } = props;
  const { onClose } = dialogProps;

  const id = file?.id ?? '';
  const { data, loading } = useFileVersionsQuery({
    variables: { id },
    skip: !file,
  });
  const total = data?.file.children.total;
  const versions: FileVersionsList =
    (data?.file.children.items.filter(
      (item) => item.type === 'FileVersion'
    ) as FileVersionsList) ?? ([] as FileVersionsList);
  const descendingVersions = versions.reduceRight(
    (descending, version) => descending.concat(version),
    [] as FileVersionsList
  );

  return !file || loading ? null : (
    <>
      <Dialog {...dialogProps} aria-labelledby="dialog-file-versions">
        <DialogTitle id="dialog-file-versions">File History</DialogTitle>
        <DialogContent>
          <List dense>
            {descendingVersions.map((version, index) => (
              <Fragment key={version.id}>
                <FileVersionItem version={version} />
                {total && index !== total - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
