import { date, number, text } from '@storybook/addon-knobs';
import React from 'react';
import { EngagementStatus } from '../../api';
import { CalendarDate } from '../../util';
import { LanguageEngagementListItemCard as Card } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <Card
    id="123123"
    status={text('status', 'InDevelopment') as EngagementStatus}
    endDate={{ value: CalendarDate.fromMillis(date('endDate')).toISO() }}
    initialEndDate={{
      value: CalendarDate.fromMillis(date('initialEndDate')).toISO(),
    }}
    completeDate={{
      value: CalendarDate.fromMillis(date('completeDate')).toISO(),
    }}
    language={{
      value: {
        name: { value: text('name', 'English') },
        rodNumber: { value: number('rodNumber', 1234) },
        organizationPopulation: { value: number('population', 10000) },
        ethnologuePopulation: { value: 0 },
        avatarLetters: 'E',
        displayName: {},
      },
    }}
    products={{ total: 1, items: [{ type: 'NewTestamentFull' }] }}
  />
);
