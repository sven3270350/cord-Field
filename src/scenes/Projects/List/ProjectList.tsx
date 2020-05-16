import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { Project } from '../../../api';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { listOrPlaceholders } from '../../../util';
import { useProjectsQuery } from './projects.generated';
import { ProjectSortOptions } from './ProjectSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  options: {
    margin: spacing(3, 0),
  },
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const sort = useSort<Project>();

  const { data } = useProjectsQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" paragraph>
        My Projects
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <ProjectSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.projects.total} Projects
      </Typography>
      {listOrPlaceholders(data?.projects.items, 5).map((item, index) => (
        <ProjectListItemCard
          key={item?.id ?? index}
          project={item}
          className={classes.projectItem}
        />
      ))}
    </div>
  );
};
