import React from 'react';
import i18next from '../i18n';

const LoadingIndicator: React.StatelessComponent = () => (
  <p>{i18next.t('loadData')}</p>
);

export default LoadingIndicator;
