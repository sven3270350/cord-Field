import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { difference, sortBy } from 'lodash';
import { IdFragment, readFragment, StepProgress } from '../../../api';
import { notNullish } from '../../../util';
import { ProductFormFragment } from '../ProductForm/ProductForm.generated';
import {
  modifyProgressRelatingToEngagement,
  progressRelatingToEngagement,
} from '../ProgressRefsRelatingToEngagement';
import { CurrentProgressOfProductFragmentDoc as CurrentProgressOfProduct } from './CurrentProgessOfProduct.generated';
import { UpdateDirectScriptureProductMutation as UpdateProductMutation } from './EditProduct.generated';

export const updateProgressSteps =
  (
    engagement: IdFragment,
    product: ProductFormFragment
  ): MutationUpdaterFunction<
    UpdateProductMutation,
    unknown,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache, mutationResult) => {
    const updated = mutationResult.data?.updateProduct.product;
    if (!updated) {
      return; // mutation failed
    }

    // Safety check, but we shouldn't ever be here without actual changes implying canEdit=true
    if (!product.steps.canEdit) {
      return;
    }

    const newSteps = updated.steps.value;
    const oldSteps = product.steps.value;
    const missingSteps = difference(newSteps, oldSteps);
    const removedSteps = difference(oldSteps, newSteps);

    const progressFromEngagement = progressRelatingToEngagement(
      cache,
      engagement
    )
      .flatMap((report) => report.progress)
      .filter((progress) => progress?.product?.id === product.id);

    // Product details also has progress for the current report so include that
    // if it has been cached.
    const current = readFragment(cache, {
      object: product,
      fragment: CurrentProgressOfProduct,
      returnPartialData: true,
    });
    const progressList = [
      ...progressFromEngagement,
      ...(current?.progressOfCurrentReportDue
        ? [current.progressOfCurrentReportDue]
        : []),
      ...(current?.progressReports ?? []),
    ];

    for (const progress of progressList.filter(notNullish)) {
      cache.modify({
        id: cache.identify(progress),
        fields: {
          steps: (prev: StepProgress[] | null) => {
            const newList = [
              ...(prev?.filter((sp) => !removedSteps.includes(sp.step)) ?? []),
              ...missingSteps.map(
                (step): Omit<StepProgress, 'percentDone'> => ({
                  __typename: 'StepProgress',
                  step,
                  completed: {
                    __typename: 'SecuredFloatNullable',
                    value: null,
                    // Assuming someone changing the product has permission
                    // to edit progress as well.
                    canRead: true,
                    canEdit: true,
                  },
                })
              ),
            ];
            // Sort list by available steps order
            const sorted = sortBy(
              newList.map((sp) => ({
                sp,
                position: updated.availableSteps.indexOf(sp.step),
              })),
              (tuple) => tuple.position
            ).map((tuple) => tuple.sp);
            return sorted;
          },
        },
      });
    }
  };

/**
 * Remove progress from all related progress reports.
 * Note eventually in future this could affect summary data as well,
 * which is not currently accounted for here.
 */
export const deleteProductProgress = (
  engagement: IdFragment,
  product: ProductFormFragment
) =>
  modifyProgressRelatingToEngagement(engagement, (list, { readField }) =>
    list.filter((progress) => {
      const productRef = readField<{ id: string }>('product', progress);
      return productRef?.id !== product.id;
    })
  );
