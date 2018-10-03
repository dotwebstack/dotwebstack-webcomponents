import React from 'react';
import i18n from '../i18n';

const LoadingIndicator: React.StatelessComponent = () => (
  <p>{i18n.t('dataladen')}</p>
);

export default LoadingIndicator;
