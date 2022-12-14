import { Grid, GridProps, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { groupBy } from 'lodash';
import Table from '../../../components/Table/Table';
import { ProductTable } from './ProductTable';
import { ProgressOfProductForReportFragment } from './ProgressReportDetail.graphql';

interface ProductTableListProps extends GridProps {
  products?: readonly ProgressOfProductForReportFragment[];
}

export const ProductTableList = ({
  products,
  ...rest
}: ProductTableListProps) => {
  const grouped = groupBy(products, (product) => product.product.category);

  return (
    <Grid item container direction="column" spacing={3} {...rest}>
      <Grid item component={Typography} variant="h3">
        {products ? 'Progress for Goals' : <Skeleton width="25%" />}
      </Grid>
      {Object.entries(grouped).map(([category, products]) => (
        <Grid item key={category} xs>
          <ProductTable category={category} products={products} />
        </Grid>
      ))}
      {!products && (
        <Grid item xs>
          <Table columns={[]} data={[]} isLoading />
        </Grid>
      )}
    </Grid>
  );
};
