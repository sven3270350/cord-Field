import { Breadcrumbs, Grid, makeStyles, Typography } from '@material-ui/core';
import { DateRange } from '@material-ui/icons';
import { Helmet } from 'react-helmet-async';
import {
  EngagementStatusLabels,
  InternshipPositionLabels,
} from '~/api/schema.graphql';
import { labelFrom, Many } from '~/common';
import { DataButton } from '../../../components/DataButton';
import { DefinedFileCard } from '../../../components/DefinedFileCard';
import { useDialog } from '../../../components/Dialog';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { FileActionsContextProvider } from '../../../components/files/FileActions';
import {
  FormattedDate,
  FormattedDateRange,
  FormattedDateTime,
} from '../../../components/Formatters';
import { OptionsIcon, PlantIcon } from '../../../components/Icons';
import { MethodologiesCard } from '../../../components/MethodologiesCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { CeremonyCard } from '../CeremonyCard';
import { DeleteEngagement } from '../Delete';
import {
  EditableEngagementField,
  EditEngagementDialog,
  Engagement,
} from '../EditEngagement/EditEngagementDialog';
import { EngagementWorkflowDialog } from '../EditEngagement/EngagementWorkflowDialog';
import { EngagementQuery } from '../Engagement.graphql';
import { UploadInternshipEngagementGrowthPlanDocument } from '../Files';
import { MentorCard } from './MentorCard';

const useStyles = makeStyles(
  ({ spacing, breakpoints, palette, typography }) => ({
    root: {
      flex: 1,
      overflowY: 'auto',
      padding: spacing(4),
    },
    main: {
      maxWidth: breakpoints.values.md,
    },
    nameRedacted: {
      width: '50%',
    },
    infoColor: {
      color: palette.info.main,
    },
    dropzoneText: {
      fontSize: typography.h2.fontSize,
    },
  })
);

export const InternshipEngagementDetail = ({ engagement }: EngagementQuery) => {
  const classes = useStyles();

  const [editState, show, editField] =
    useDialog<Many<EditableEngagementField>>();
  const [workflowState, openWorkflow, workflowEngagement] =
    useDialog<Engagement>();

  if (engagement.__typename !== 'InternshipEngagement') {
    return null; // easiest for typescript
  }

  const intern = engagement.intern.value;
  const name = intern?.fullName;

  return (
    <>
      <Helmet
        title={`${name ?? 'An Engagement'} in ${
          engagement.project.name.value ?? 'a project'
        }`}
      />
      <div className={classes.root}>
        <Grid
          component="main"
          container
          direction="column"
          spacing={3}
          className={classes.main}
        >
          <Grid item>
            <Breadcrumbs>
              <ProjectBreadcrumb data={engagement.project} />
              <EngagementBreadcrumb data={engagement} />
            </Breadcrumbs>
          </Grid>
          <Grid item container spacing={3} alignItems="center">
            <Grid item container spacing={3} alignItems="center">
              <Grid item className={name ? undefined : classes.nameRedacted}>
                <Typography
                  variant="h2"
                  {...(intern
                    ? { component: Link, to: `/users/${intern.id}` }
                    : {})}
                >
                  {name ?? (
                    <Redacted
                      info={`You do not have permission to view this engagement's ${
                        intern ? 'name' : 'intern'
                      }`}
                      width="100%"
                    />
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <DeleteEngagement
                  project={engagement.project}
                  engagement={engagement}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3} alignItems="center">
              <Grid item>
                <Typography variant="h4">Intern Engagement</Typography>
              </Grid>

              <Grid item>
                <Typography variant="body2" color="textSecondary">
                  Updated <FormattedDateTime date={engagement.modifiedAt} />
                </Typography>
              </Grid>
            </Grid>
            <Grid item container spacing={1} alignItems="center">
              <Grid item>
                <DataButton
                  secured={engagement.status}
                  redacted="You do not have permission to view the engagement's status"
                  onClick={() => openWorkflow(engagement)}
                  children={labelFrom(EngagementStatusLabels)}
                />
              </Grid>
              <Grid item>
                <DataButton
                  startIcon={<DateRange className={classes.infoColor} />}
                  secured={engagement.dateRange}
                  redacted="You do not have permission to view start/end dates"
                  children={FormattedDateRange.orNull}
                  empty="Start - End"
                  onClick={() => show('dateRangeOverride')}
                />
              </Grid>
              <Grid item>
                <DataButton
                  secured={engagement.position}
                  empty="Enter Intern Position"
                  redacted="You do not have permission to view intern position"
                  children={labelFrom(InternshipPositionLabels)}
                  onClick={() => show('position')}
                />
              </Grid>
              <Grid item>
                <DataButton
                  secured={engagement.countryOfOrigin}
                  empty="Enter Country of Origin"
                  redacted="You do not have permission to view country of origin"
                  children={(location) => location.name.value}
                  onClick={() => show('countryOfOriginId')}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={6}>
                <FieldOverviewCard
                  title="Growth Plan Complete Date"
                  data={{
                    value: engagement.completeDate.value ? (
                      <FormattedDate date={engagement.completeDate.value} />
                    ) : undefined,
                  }}
                  icon={PlantIcon}
                  onClick={() => show('completeDate')}
                  onButtonClick={() => show('completeDate')}
                />
              </Grid>
              <Grid item xs={6}>
                <FieldOverviewCard
                  title="Disbursement Complete Date"
                  data={{
                    value: engagement.disbursementCompleteDate.value ? (
                      <FormattedDate
                        date={engagement.disbursementCompleteDate.value}
                      />
                    ) : undefined,
                  }}
                  icon={OptionsIcon}
                  onClick={() => show('disbursementCompleteDate')}
                  onButtonClick={() => show('disbursementCompleteDate')}
                />
              </Grid>
              <Grid item container spacing={3} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h4">Growth Plan</Typography>
                </Grid>
              </Grid>
              <Grid item container spacing={3} alignItems="center">
                <FileActionsContextProvider>
                  <Grid item xs={6}>
                    <DefinedFileCard
                      label="Growth Plan"
                      parentId={engagement.id}
                      uploadMutationDocument={
                        UploadInternshipEngagementGrowthPlanDocument
                      }
                      resourceType="engagement"
                      securedFile={engagement.growthPlan}
                    />
                  </Grid>
                </FileActionsContextProvider>
              </Grid>
              <Grid item xs={6}>
                <MethodologiesCard
                  onClick={() => show('methodologies')}
                  data={engagement.methodologies}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={3}>
              <Grid item xs={6}>
                <CeremonyCard {...engagement.ceremony} />
              </Grid>
              <MentorCard
                data={engagement.mentor}
                wrap={(node) => (
                  <Grid item xs={6}>
                    {node}
                  </Grid>
                )}
                onEdit={() => show('mentorId')}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <EditEngagementDialog
        {...editState}
        engagement={engagement}
        editFields={editField}
      />
      {workflowEngagement && (
        <EngagementWorkflowDialog
          {...workflowState}
          engagement={workflowEngagement}
        />
      )}
    </>
  );
};
