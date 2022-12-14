import { makeStyles, CssBaseline as MuiCssBaseline } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  // Use @global basically never
  '@global': {
    '#root': {
      minHeight: '100vh',
      display: 'flex',
    },
  },
}));

export const CssBaseline = () => {
  useStyles();
  return <MuiCssBaseline />;
};
