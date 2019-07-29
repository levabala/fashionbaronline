import './SubscriptionSmall.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import SubscriptionBlock from '../SubscriptionBlock';

const SubscriptionSmall = () => {
  const { t } = useTranslation();

  return (
    <div className="subscriptionSmall">
      <div className="label">{t("subscriptionSmall.label")}</div>
      <SubscriptionBlock />
    </div>
  );
};

export default SubscriptionSmall;
