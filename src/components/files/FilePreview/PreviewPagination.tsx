import { Box } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { FC, useCallback, useEffect } from 'react';
import { usePreview } from './PreviewContext';

interface PreviewPaginationProps {
  pageCount: number;
}

export const PreviewPagination: FC<PreviewPaginationProps> = (props) => {
  const { children, pageCount } = props;
  const { previewPage, setPreviewPage } = usePreview();

  useEffect(() => {
    return () => setPreviewPage(1);
  }, [setPreviewPage]);

  const handleChange = useCallback(
    (_, value) => {
      setPreviewPage(value);
    },
    [setPreviewPage]
  );

  return (
    <>
      <Box width="100%" display="flex" justifyContent="center">
        <Pagination
          count={pageCount}
          onChange={handleChange}
          page={previewPage}
          showFirstButton
          showLastButton
        />
      </Box>
      <Box>{children}</Box>
    </>
  );
};
