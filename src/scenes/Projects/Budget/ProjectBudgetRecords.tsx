import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { sumBy } from 'lodash';
import { Column, Components } from 'material-table';
import React, { FC, useMemo } from 'react';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import { Table } from '../../../components/Table';
import {
  BudgetRecordFragment as BudgetRecord,
  ProjectBudgetQuery,
  useUpdateProjectBudgetRecordMutation,
} from './ProjectBudget.generated';

const useStyles = makeStyles(({ spacing }) => ({
  header: {
    margin: spacing(3, 0),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLoading: {
    width: '10%',
  },
}));

const tableComponents: Components = {
  // No toolbar since it's just empty space, we don't use it for anything.
  Toolbar: () => null,
};

interface BudgetRowData {
  id: string;
  organization: string;
  fiscalYear: string;
  amount: string | null;
  canEdit: boolean;
}

interface ProjectBudgetRecordsProps {
  budget: ProjectBudgetQuery['project']['budget'] | undefined;
  loading: boolean;
}

export const ProjectBudgetRecords: FC<ProjectBudgetRecordsProps> = (props) => {
  const { loading, budget } = props;
  const classes = useStyles();
  const formatCurrency = useCurrencyFormatter();
  const [updateBudgetRecord] = useUpdateProjectBudgetRecordMutation();

  const records: readonly BudgetRecord[] = budget?.value?.records ?? [];

  const budgetTotal = sumBy(records, (record) => record.amount.value ?? 0);

  const rowData = records.map<BudgetRowData>((record) => ({
    id: record.id,
    organization: record.organization.value?.name.value ?? '',
    fiscalYear: String(record.fiscalYear.value),
    amount: String(record.amount.value ?? ''),
    canEdit: record.amount.canEdit,
  }));

  const blankAmount = 'click to edit';
  const columns: Array<Column<BudgetRowData>> = useMemo(
    () => [
      {
        field: 'id',
        hidden: true,
      },
      {
        field: 'organization',
        editable: 'never',
      },
      {
        field: 'fiscalYear',
        editable: 'never',
      },
      {
        field: 'amount',
        type: 'currency',
        editable: (_, rowData) => rowData.canEdit,
        render: (rowData) =>
          rowData.amount ? formatCurrency(Number(rowData.amount)) : blankAmount,
      },
      {
        field: 'canEdit',
        hidden: true,
      },
    ],
    [formatCurrency]
  );

  return (
    <>
      <header className={classes.header}>
        <Typography variant="h2">Budget</Typography>
        <Typography
          variant="h3"
          className={loading ? classes.totalLoading : undefined}
        >
          {!loading ? (
            `Total: ${formatCurrency(budgetTotal)}`
          ) : (
            <Skeleton width="100%" />
          )}
        </Typography>
      </header>
      <Table
        data={rowData}
        columns={columns}
        isLoading={loading}
        components={tableComponents}
        cellEditable={
          budget?.canEdit
            ? {
                onCellEditApproved: async (newAmount, _, data) => {
                  if (newAmount === blankAmount || newAmount === '') return;
                  const input = {
                    budgetRecord: {
                      id: data.id,
                      amount: Number(newAmount),
                    },
                  };
                  await updateBudgetRecord({ variables: { input } });
                },
              }
            : undefined
        }
      />
    </>
  );
};
