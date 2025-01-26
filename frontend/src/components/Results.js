import React from 'react';
import { useTranslation } from 'react-i18next';

const Results = ({ recommendation }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('results')}</h2>
      <p>
        <strong>{t('recommendation')}:</strong> {recommendation || t('no_results')}
      </p>
    </div>
  );
};

export default Results;
