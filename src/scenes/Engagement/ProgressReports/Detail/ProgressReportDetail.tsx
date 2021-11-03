import { useQuery } from '@apollo/client';
import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { canEditAny } from '../../../../api';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { EngagementBreadcrumb } from '../../../../components/EngagementBreadcrumb';
import { Error } from '../../../../components/Error';
import { Fab } from '../../../../components/Fab';
import { FieldOverviewCard } from '../../../../components/FieldOverviewCard';
import { FormattedDate } from '../../../../components/Formatters';
import { ReportLabel } from '../../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../../components/Redacted';
import { UpdatePeriodicReportDialog } from '../../../Projects/Reports/UpdatePeriodicReportDialog';
import { useProjectId } from '../../../Projects/useProjectId';
import { ProductTableList } from './ProductTableList';
import { ProgressReportCard } from './ProgressReportCard';
import { ProgressReportDetailDocument } from './ProgressReportDetail.generated';
import { ProgressSummaryCard } from './ProgressSummaryCard';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
  },
  main: {
    padding: spacing(4),
    maxWidth: breakpoints.values.md,
  },
  header: {
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  subheader: {
    margin: spacing(2, 0, 4),
  },
}));

export const ProgressReportDetail: FC = () => {
  const classes = useStyles();
  const { changesetId } = useProjectId();
  const { engagementId = '', progressReportId = '' } = useParams();
  const windowSize = useWindowSize();

  // Single file for new version, empty array for received date update.
  const [dialogState, setUploading, upload] = useDialog<File[]>();

  const { data, error } = useQuery(ProgressReportDetailDocument, {
    variables: {
      changeset: changesetId,
      engagementId,
      progressReportId,
    },
  });
  if (error) {
    return (
      <Error page error={error}>
        {{
          NotFound: 'Could not find progress report',
          Default: 'Error loading progress report',
        }}
      </Error>
    );
  }

  const report =
    data?.periodicReport.__typename === 'ProgressReport'
      ? data.periodicReport
      : null;
  const editable = canEditAny(report);

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Helmet title="Progress Report" />
        <Breadcrumbs
          children={[
            <ProjectBreadcrumb data={data?.engagement.project} />,
            <EngagementBreadcrumb data={data?.engagement} />,
            <Breadcrumb to="..">
              {!report ? <Skeleton width={200} /> : 'Progress Reports'}
            </Breadcrumb>,
            <Breadcrumb to=".">
              {!report ? (
                <Skeleton width={200} />
              ) : (
                <ReportLabel report={report} />
              )}
            </Breadcrumb>,
          ]}
        />

        <Grid
          container
          spacing={3}
          alignItems="center"
          className={classes.header}
        >
          <Grid item component={Typography} variant="h2">
            {data ? (
              <>
                Progress Report - <ReportLabel report={report} />
              </>
            ) : (
              <Skeleton width={442} />
            )}
          </Grid>
          {(editable || !report) && (
            <Grid item>
              <Tooltip title="Update received date or skipped reason">
                <Fab
                  color="primary"
                  aria-label="Update report"
                  loading={!report}
                  onClick={() => setUploading([])}
                >
                  <Edit />
                </Fab>
              </Tooltip>
              {report && (
                <UpdatePeriodicReportDialog
                  {...dialogState}
                  report={{ ...report, reportFile: upload }}
                  editFields={[
                    'receivedDate',
                    ...(upload && upload.length > 0
                      ? ['reportFile' as const]
                      : []),
                  ]}
                />
              )}
            </Grid>
          )}
        </Grid>

        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.subheader}
        >
          {!report ? (
            <Skeleton width="20ch" />
          ) : report.receivedDate.value ? (
            <>
              Received on <FormattedDate date={report.receivedDate.value} />
            </>
          ) : !report.receivedDate.canRead ? (
            <Redacted info="You don't have permission to view the received date" />
          ) : (
            'Not received yet'
          )}
        </Typography>

        <Grid container direction="column" spacing={3}>
          <Grid item container spacing={3}>
            <Grid item xs={12} md={7} container>
              <ProgressSummaryCard
                loading={!report}
                summary={report?.cumulativeSummary ?? null}
              />
            </Grid>
            <Grid item xs={12} md={5} container>
              {report ? (
                <ProgressReportCard
                  progressReport={report}
                  disableIcon
                  onUpload={({ files }) => setUploading(files)}
                />
              ) : (
                <FieldOverviewCard />
              )}
            </Grid>
          </Grid>
          <ProductTableList
            products={report?.progress}
            style={{
              maxWidth:
                windowSize.width !== Infinity
                  ? // window - sidebar - margin
                    windowSize.width - 248 - 8 * 2
                  : undefined,
            }}
          />
        </Grid>
      </main>
    </div>
  );
};
