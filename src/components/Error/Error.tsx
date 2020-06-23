import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

interface ErrorProps {
  navigateBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'Error' | '404';
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  errorType: {
    display: 'flex',
  },
  boldText: {
    fontWeight: 'bold',
    marginRight: spacing(1),
  },
  button: {
    height: spacing(4),
    width: spacing(16),
    marginTop: spacing(2),
  },
}));

export const Error: FC<ErrorProps> = ({ navigateBack, variant = 'Error' }) => {
  const classes = useStyles();

  const errorMessage =
    variant === 'Error' ? (
      <Typography variant="h3" className={classes.boldText}>
        ERROR
      </Typography>
    ) : (
      <div className={classes.errorType}>
        <Typography variant="h3" className={classes.boldText}>
          404
        </Typography>
        <Typography variant="h3">PAGE NOT FOUND</Typography>
      </div>
    );
  return (
    <div className={classes.container}>
      <Typography>Oops, Sorry.</Typography>
      {errorMessage}
      <Button
        onClick={navigateBack}
        variant="contained"
        color="secondary"
        classes={{ root: classes.button }}
      >
        Back
      </Button>
    </div>
  );
};
