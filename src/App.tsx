import LuxonUtils from '@date-io/luxon';
import { ThemeProvider } from '@material-ui/core';
import { LocalizationProvider } from '@material-ui/pickers';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import * as React from 'react';
import { ApolloProvider } from './api';
import { Nest } from './components/Nest';
import { SnackbarProvider } from './components/Snackbar';
import { UploadManagerProvider, UploadProvider } from './components/Upload';
import { SensitiveOperations } from './scenes/Authentication';
import { Root } from './scenes/Root';
import { createTheme } from './theme';

const logRocketAppId = process.env.RAZZLE_LOG_ROCKET_APP_ID;
if (logRocketAppId) {
  LogRocket.init(logRocketAppId, {
    shouldParseXHRBlob: true, // Parse API response bodies
    network: {
      requestSanitizer(request) {
        // Relies on operation name suffix which do in Apollo HttpLink config
        if (SensitiveOperations.some((op) => request.url.endsWith('/' + op))) {
          request.body = undefined;
        }
        return request;
      },
    },
  });
  if (typeof window !== 'undefined') {
    setupLogRocketReact(LogRocket);
  }
}

const theme = createTheme();

/**
 * Register all app providers here in a flat list.
 * These are used client-side, server-side, and in storybook.
 * This prevents git diff churning
 * Order still matters (the first is the outer most component)
 */
export const appProviders = [
  <ThemeProvider theme={theme} children={<></>} />,
  <LocalizationProvider dateAdapter={LuxonUtils as any} children={<></>} />,
  <SnackbarProvider />, // needed by apollo
  <ApolloProvider />,
  <UploadManagerProvider />,
  <UploadProvider />,
];

export const App = () => (
  <Nest elements={appProviders}>
    <Root />
  </Nest>
);
