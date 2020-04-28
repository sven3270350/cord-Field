import { CircularProgress, makeStyles, ThemeProvider } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate, useRoutes } from 'react-router-dom';
import { Picture } from '../../components/Picture';
import { useSession } from '../../components/Session';
import { createTheme } from '../../theme';
import backgroundImg from './background.png';
import { ForgotPassword } from './ForgotPassword';
import { Login } from './Login/Login';
import { Logout } from './Logout';
import { ResetPassword } from './ResetPassword';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: palette.background.default,
  },
  card: {
    maxWidth: 400,
  },
}));

const authTheme = createTheme({ dark: true });

export const Authentication: FC = ({ children }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, sessionLoading] = useSession();

  const matched = useRoutes([
    { path: '/login', element: <Login className={classes.card} /> },
    { path: '/logout', element: <Logout /> },
    {
      path: '/forgot-password',
      element: <ForgotPassword className={classes.card} />,
    },
    {
      path: '/reset-password/:token',
      element: <ResetPassword className={classes.card} />,
    },
  ]);

  useEffect(() => {
    if (!session && !sessionLoading && !matched) {
      const current = location.pathname + location.search + location.hash;
      const returnTo =
        current !== '/' ? encodeURIComponent(current) : undefined;
      const search = returnTo ? `?returnTo=${returnTo}` : undefined;
      navigate({ pathname: '/login', search }, { replace: true });
    }
  }, [session, sessionLoading, navigate, matched, location]);

  // render anonymous auth scene, or spinner while waiting
  // for session or redirect to login when not logged in
  if (matched || !session) {
    return (
      <ThemeProvider theme={authTheme}>
        <AuthScene>{matched ?? <CircularProgress />}</AuthScene>
      </ThemeProvider>
    );
  }

  // logged in, show app
  return <>{children}</>;
};

const AuthScene: FC = ({ children }) => {
  const classes = useStyles(); // has auth theme applied
  return (
    <div className={classes.root}>
      <Picture background source={backgroundImg} />
      {children}
    </div>
  );
};
