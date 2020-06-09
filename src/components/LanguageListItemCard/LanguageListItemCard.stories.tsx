import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import { LanguageListItemFragment } from './LanguageListItem.generated';
import { LanguageListItemCard } from './LanguageListItemCard';

export default { title: 'Components/Language List Item Card' };

export const WithData = () => {
  const language: LanguageListItemFragment = {
    id: '123',
    name: {
      value: text('name', 'English'),
    },
    displayName: {
      value: text('display name', 'German'),
    },
    ethnologueName: {
      value: text('ethnologue name', 'cnk'),
    },
    rodNumber: {
      value: number('rod number', 5182),
    },
    organizationPopulation: {
      value: number('organization population', 20000),
    },
    ethnologuePopulation: {
      value: number('ethnologue population', 10000),
    },
  };

  return <LanguageListItemCard language={language} />;
};

export const Loading = () => <LanguageListItemCard />;