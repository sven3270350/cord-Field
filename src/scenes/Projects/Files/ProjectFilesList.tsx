import {
  Box,
  Breadcrumbs,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { File, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useDialog } from '../../../components/Dialog';
import {
  FileActionsPopup as ActionsMenu,
  DeleteFile,
  FileActionHandler,
  FileActionItem,
  RenameFile,
} from '../../../components/files/FileActionsMenu';
import {
  useDownloadFile,
  useFileNameAndExtension,
  useFileNodeIcon,
} from '../../../components/files/hooks';
// import { FilePreview } from '../../../components/FilePreview';
import {
  formatFileSize,
  useDateFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { RowData, Table } from '../../../components/Table';
import { FileCreateActions } from './FileCreateActions';
import { FileVersions } from './FileVersions';
import { useProjectDirectoryQuery } from './ProjectFiles.generated';
import { UploadProjectFileVersion } from './UploadProjectFileVersion';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

const useStyles = makeStyles(({ spacing }) => ({
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
  tableWrapper: {
    marginTop: spacing(4),
  },
  folderLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  fileName: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: spacing(0.5),
  },
}));

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { projectId } = useParams();
  const formatDate = useDateFormatter();
  const downloadFile = useDownloadFile();
  const fileNameAndExtension = useFileNameAndExtension();
  const fileIcon = useFileNodeIcon();

  const [renameFileState, renameFile, itemToRename] = useDialog<
    FileActionItem
  >();
  const [fileVersionState, showVersions, fileVersionToView] = useDialog<File>();
  const [newVersionState, createNewVersion, fileToVersion] = useDialog<File>();
  const [deleteFileState, deleteFile, itemToDelete] = useDialog<
    FileActionItem
  >();
  // const [filePreviewState, previewFile, fileToPreview] = useDialog<File>();

  const actions = {
    rename: (item: FileActionItem) => renameFile(item as any),
    download: (item: FileActionItem) => downloadFile(item as File),
    history: (item: FileActionItem) => showVersions(item as File),
    'new version': (item: FileActionItem) => createNewVersion(item as File),
    delete: (item: FileActionItem) => deleteFile(item as any),
  };

  const handleFileActionClick: FileActionHandler = (item, action) => {
    actions[action](item);
  };

  const {
    project,
    directoryId,
    rootDirectoryId,
  } = useProjectCurrentDirectory();
  const isNotRootDirectory = directoryId !== rootDirectoryId;

  const { data, loading, error } = useProjectDirectoryQuery({
    variables: {
      id: directoryId,
    },
    skip: !directoryId,
  });

  const parents = data?.directory.parents ?? [];
  const breadcrumbsParents = parents.slice(0, -1);

  const directoryIsNotInProject =
    isNotRootDirectory &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  const columns = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Category',
      field: 'category',
      hidden: true,
    },
    {
      title: 'Name',
      field: 'name',
      render: (rowData: RowData) => {
        const { category, id, name, item } = rowData;
        const Icon = fileIcon(category);
        const isDirectory = category === 'Directory';
        const content = (
          <span
            className={classes.fileName}
            onClick={
              isDirectory
                ? undefined
                : () => console.log('Preview file', item.id)
            }
          >
            <Icon className={classes.fileIcon} />
            {fileNameAndExtension(name).displayName}
          </span>
        );
        return isDirectory ? (
          <Link
            className={classes.folderLink}
            to={`/projects/${projectId}/folders/${id}`}
          >
            {content}
          </Link>
        ) : (
          content
        );
      },
    },
    {
      title: 'Created',
      field: 'createdAt',
    },
    {
      title: 'Uploaded By',
      field: 'createdBy',
    },
    {
      title: 'File Size',
      field: 'size',
      render: (rowData: RowData) => {
        const { category, size } = rowData;
        return category === 'Directory' ? '–' : formatFileSize(Number(size));
      },
    },
    {
      title: '',
      field: 'item',
      render: (rowData: RowData) => (
        <ActionsMenu item={rowData.item} onFileAction={handleFileActionClick} />
      ),
      sorting: false,
      cellStyle: {
        padding: spacing(0.5),
        width: spacing(6),
      },
      headerStyle: {
        padding: spacing(0.5),
      },
    },
  ];

  const rowData =
    items?.reduce((rows: RowData[], item) => {
      const isDirectory = item.type === 'Directory';
      const isFileVersion = item.type === 'FileVersion';
      const { id, name, category, createdAt, createdBy } = item;
      const {
        displayFirstName: { value: firstName },
        displayLastName: { value: lastName },
      } = createdBy;

      const row = {
        id,
        category,
        name,
        createdAt: formatDate(createdAt),
        createdBy: `${firstName} ${lastName}`,
        size: isDirectory ? 0 : (item as File | FileVersion).size,
        item,
      };
      return isFileVersion ? rows : rows.concat(row);
    }, []) ?? [];

  return (
    <Content>
      {error || (!loading && !items) ? (
        <Typography variant="h4">Error fetching Project Files</Typography>
      ) : directoryIsNotInProject ? (
        <Typography variant="h4">
          This folder does not exist in this project
        </Typography>
      ) : (
        <>
          {loading ? (
            <Skeleton variant="text" width="20%" />
          ) : (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Breadcrumbs>
                <ProjectBreadcrumb data={project} />
                <Breadcrumb to={`/projects/${projectId}/files`}>
                  Files
                </Breadcrumb>
                {breadcrumbsParents.map((parent) => (
                  <Breadcrumb
                    key={parent.id}
                    to={`/projects/${projectId}/folders/${parent.id}`}
                  >
                    {parent.name}
                  </Breadcrumb>
                ))}
                {isNotRootDirectory && (
                  <Breadcrumb
                    to={`/projects/${projectId}/folders/${directoryId}`}
                  >
                    {data?.directory.name}
                  </Breadcrumb>
                )}
              </Breadcrumbs>
              <FileCreateActions />
            </Box>
          )}
          <header className={classes.headerContainer}>
            {loading ? (
              <>
                <Skeleton variant="text" width="20%" />
              </>
            ) : (
              <Typography variant="h2" className={classes.title}>
                Files
              </Typography>
            )}
          </header>
          <section className={classes.tableWrapper}>
            {loading ? (
              <Skeleton variant="rect" width="100%" height={200} />
            ) : (
              <Table data={rowData} columns={columns} />
            )}
          </section>
        </>
      )}
      <RenameFile item={itemToRename} {...renameFileState} />
      <DeleteFile item={itemToDelete} {...deleteFileState} />
      <FileVersions file={fileVersionToView} {...fileVersionState} />
      <UploadProjectFileVersion file={fileToVersion} {...newVersionState} />
      {/* <FilePreview file={fileToPreview} {...filePreviewState} /> */}
    </Content>
  );
};
