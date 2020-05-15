import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  TypographyProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayStatus } from '../../api/displayStatus';
import { displayLocation } from '../../api/location-helper';
import { Picture, useRandomPicture } from '../Picture';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { ProjectListItemFragment } from './ProjectListItem.generated';

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    leftContent: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    rightContent: {
      flex: 1,
      textAlign: 'right',
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    sensitivity: {
      marginBottom: spacing(1),
    },
    skeletonRight: {
      marginLeft: 'auto',
    },
  };
});

export interface ProjectListItemCardProps {
  project?: ProjectListItemFragment;
  className?: string;
}

export const ProjectListItemCard: FC<ProjectListItemCardProps> = ({
  project,
  className,
}) => {
  const classes = useStyles();
  const pic = useRandomPicture({ seed: project?.id, width: 300, height: 200 });

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!project}
        to={`/projects/${project?.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          {!project ? (
            <Skeleton variant="rect" height={200} />
          ) : (
            <Picture fit="cover" {...pic} />
          )}
        </div>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
            className={classes.leftContent}
          >
            <Grid item>
              <Typography variant="h4">
                {!project ? <Skeleton variant="text" /> : project.name?.value}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {!project ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  project.deptId.value ?? project.id
                )}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <Skeleton variant="text" />
                ) : (
                  displayLocation(project.location.value)
                )}
              </Typography>
            </Grid>
            <Grid item>
              <Sensitivity
                value={project?.sensitivity}
                loading={!project}
                className={classes.sensitivity}
              />
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" width="50%" />
              ) : (
                <KeyValProp
                  label="Status"
                  value={displayStatus(project.status)}
                />
              )}
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <KeyValProp aria-hidden="true" />

            <div>
              <Typography variant="h1">
                {!project ? (
                  <Skeleton
                    variant="text"
                    width="1ch"
                    className={classes.skeletonRight}
                  />
                ) : (
                  0
                )}
              </Typography>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <>
                    <Skeleton
                      variant="text"
                      width="9ch"
                      className={classes.skeletonRight}
                    />
                    <Skeleton
                      variant="text"
                      width="11ch"
                      className={classes.skeletonRight}
                    />
                  </>
                ) : (
                  <>
                    {project.type === 'Internship' ? 'Internship' : 'Language'}
                    <br />
                    Engagements
                  </>
                )}
              </Typography>
            </div>
            {!project ? (
              <Skeleton variant="text" />
            ) : (
              <KeyValProp
                label="ESAD"
                value={project.estimatedSubmission?.value}
                ValueProps={{ color: 'primary' }}
              />
            )}
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};

const KeyValProp = ({
  label,
  LabelProps,
  value,
  ValueProps,
  loading,
  ...props
}: {
  label?: string;
  LabelProps?: TypographyProps;
  value?: string | null;
  ValueProps?: TypographyProps;
  loading?: boolean;
} & TypographyProps) => (
  <Typography variant="body2" {...props}>
    {loading ? (
      <Skeleton variant="text" />
    ) : label && value ? (
      <>
        <Typography variant="inherit" {...LabelProps}>
          {label}:&nbsp;
        </Typography>
        <Typography variant="inherit" color="textSecondary" {...ValueProps}>
          {value}
        </Typography>
      </>
    ) : null}
  </Typography>
);
