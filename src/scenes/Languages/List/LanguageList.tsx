import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { pickBy } from 'lodash';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { Language } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { LanguageListItemCard as LanguageCard } from '../../../components/LanguageListItemCard';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import {
  LanguageFilterOptions,
  useLanguageFilters,
} from './LanguageFilterOptions';
import { LanguagesDocument as Languages } from './languages.generated';
import { LanguageSortOptions } from './LanguageSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  items: {
    maxWidth: 400,
  },
}));

export const LanguageList: FC = () => {
  const sort = useSort<Language>();
  const [filter, setFilters] = useLanguageFilters();
  const list = useListQuery(Languages, {
    listAt: (data) => data.languages,
    variables: {
      input: {
        ...sort.value,
        filter,
      },
    },
  });

  const classes = useStyles();
  const formatNumber = useNumberFormatter();

  return (
    <ContentContainer>
      <Helmet title="Languages" />
      <Typography variant="h2" paragraph>
        Languages
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <LanguageSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <FilterButtonDialog values={pickBy(filter)} onChange={setFilters}>
            <LanguageFilterOptions />
          </FilterButtonDialog>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {list.data ? (
          `${formatNumber(list.data.total)} Languages`
        ) : (
          <Skeleton width="14ch" />
        )}
      </Typography>
      <List
        {...list}
        classes={{ container: classes.items }}
        renderItem={(item) => <LanguageCard language={item} />}
        renderSkeleton={<LanguageCard />}
        skeletonCount={10}
      />
    </ContentContainer>
  );
};
