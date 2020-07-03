import { makeStyles, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useInterval } from 'react-use';
import { isSecured } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Fab } from '../../../components/Fab';
import { Redacted } from '../../../components/Redacted';
import { EditUser } from '../Edit';
import { useUserQuery } from './UserDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
    maxWidth: breakpoints.values.md,
  },
  name: {
    marginRight: spacing(4),
  },
  nameLoading: {
    width: '60%',
  },
  header: {
    flex: 1,
    display: 'flex',
  },
}));

export const UserDetail = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const { data, error } = useUserQuery({
    variables: { userId },
  });

  const [editUserState, editUser] = useDialog();

  const user = data?.user;

  const canEditAnyFields = !user
    ? false
    : Object.entries(user).some(([_, value]) =>
        isSecured(value) ? value.canEdit : false
      );

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading person</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                user?.fullName ? null : classes.nameLoading
              )}
            >
              {!user ? (
                <Skeleton width="100%" />
              ) : (
                user.fullName ?? (
                  <Redacted
                    info="You don't have permission to view this person's name"
                    width="100%"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Fab color="primary" aria-label="edit person" onClick={editUser}>
                <Edit />
              </Fab>
            ) : null}
          </div>
          <DisplayProperty
            label="Email"
            value={user?.email.value}
            loading={!user}
          />
          <DisplayProperty
            label="Local Time"
            value={
              user?.timezone.value?.name ? (
                <LocalTime timezone={user?.timezone.value?.name} />
              ) : null
            }
            loading={!user}
          />
          <DisplayProperty
            label="Phone"
            value={user?.phone.value}
            loading={!user}
          />
          <DisplayProperty
            label="Biography"
            value={user?.bio.value}
            loading={!user}
          />
          {user ? <EditUser user={user} {...editUserState} /> : null}
        </>
      )}
    </main>
  );
};

const LocalTime = ({ timezone }: { timezone?: string }) => {
  const now = useNow();
  const formatted = now.toLocaleString({
    timeZone: timezone,
    ...DateTime.TIME_SIMPLE,
    timeZoneName: 'short',
  });
  return <>{formatted}</>;
};

const useNow = (updateInterval = 1_000) => {
  const [now, setNow] = useState(() => DateTime.local());
  useInterval(() => {
    setNow(DateTime.local());
  }, updateInterval);
  return now;
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      loadingWidth="40%"
      {...{ component: 'div' }}
      {...props}
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
