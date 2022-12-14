import { ErrorHandler } from '@apollo/client/link/error';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ProviderContext as Snackbar, useSnackbar } from 'notistack';
import { useRef } from 'react';

export const useErrorRendererRef = () => {
  // Using ref to store error handler function, so it can be swapped on each
  // render with one that has access to the current snackbar functions.
  // (While still allowing use of the same single link)
  const errorRendererRef = useRef<ErrorHandler>();
  errorRendererRef.current = errorRenderer(useSnackbar());

  return errorRendererRef;
};

const errorRenderer =
  ({ enqueueSnackbar, closeSnackbar }: Snackbar): ErrorHandler =>
  ({ graphQLErrors, networkError }) => {
    if (networkError?.message === 'Failed to fetch') {
      enqueueSnackbar('Unable to communicate with CORD Platform', {
        variant: 'error',
        preventDuplicate: true,
      });
      return;
    }

    for (const gqlError of graphQLErrors || []) {
      const ext = gqlError.extensions as {
        code: string;
        status: number;
        exception?: { stacktrace: string[] };
      };
      const schemaError = ext.code === 'INTERNAL_SERVER_ERROR';

      if (!schemaError && ext.status < 500) {
        continue;
      }

      const trace: string[] = ext.exception?.stacktrace ?? [];
      if (trace.length > 0 && !schemaError) {
        console.error(trace.join('\n'));
      }
      enqueueSnackbar(gqlError.message, {
        variant: 'error',
        persist: true,
        action: (key: string) => (
          <IconButton color="inherit" onClick={() => closeSnackbar(key)}>
            <Close />
          </IconButton>
        ),
      });
    }
  };
