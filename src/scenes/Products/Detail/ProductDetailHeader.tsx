import {
  Breadcrumbs,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Fab } from '../../../components/Fab';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Redacted } from '../../../components/Redacted';
import { Link } from '../../../components/Routing';
import { ProductDetailFragment as Product } from './ProductDetail.graphql';

const useStyles = makeStyles(() => ({
  nameRedacted: {
    width: '50%',
  },
}));

export const ProductDetailHeader = ({ product }: { product?: Product }) => {
  const classes = useStyles();

  const language = product?.engagement.language.value;
  const langName = language?.name.value ?? language?.displayName.value;
  const project = product?.engagement.project;

  return (
    <>
      <Helmet
        title={`${product?.label ?? 'Goal'} - ${langName ?? 'A Language'}`}
      />
      <Grid item>
        <Breadcrumbs>
          <ProjectBreadcrumb data={project} />
          <EngagementBreadcrumb data={product?.engagement} />
          <Breadcrumb to=".">Goal</Breadcrumb>
        </Breadcrumbs>
      </Grid>
      <Grid item container spacing={3} alignItems="center">
        <Grid
          item
          className={product?.label ? undefined : classes.nameRedacted}
        >
          <Typography variant="h2">
            {product?.label ?? (
              <Redacted
                info={`You do not have permission to view this product's label`}
                width="100%"
              />
            )}
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Edit Goal">
            <Fab
              color="primary"
              // @ts-expect-error it works. These generics are hard to express.
              component={Link}
              to="edit"
            >
              <Edit />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h4">
          {product ? (
            <>Goal {product.category ? ` - ${product.category}` : ''}</>
          ) : (
            <Skeleton width="25%" />
          )}
        </Typography>
      </Grid>
    </>
  );
};
