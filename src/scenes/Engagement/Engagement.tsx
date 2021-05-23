import { useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router';
import { NotFoundPage } from '../../components/Error';
import { usePlanChange } from '../../components/PlanChangeCard';
import { EngagementDocument } from './Engagement.generated';
import { EngagementDetailLoading } from './EngagementDetailLoading';
import { InternshipEngagementDetail } from './InternshipEngagement';
import { LanguageEngagementDetail } from './LanguageEngagement';

export const Engagement = () => {
  const { engagementId = '', projectId = '' } = useParams();
  const { planChangeId } = usePlanChange();
  const { data, loading } = useQuery(EngagementDocument, {
    variables: {
      projectId,
      engagementId,
      changeId: planChangeId ? planChangeId : null,
    },
  });

  if (loading) {
    return <EngagementDetailLoading />;
  }
  if (!data) {
    return <NotFoundPage>Could not find engagement</NotFoundPage>;
  }
  if (data.engagement.__typename === 'LanguageEngagement') {
    return <LanguageEngagementDetail {...data} />;
  }
  return <InternshipEngagementDetail {...data} />;
};
