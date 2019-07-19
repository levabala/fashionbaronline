import './SubscriptionSmall.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

const SubscriptionSmall = () => {
  const { t } = useTranslation();

  return (
    <div className="subscriptionSmall">
      <div className="label">{t("subscriptionSmall.label")}</div>
      <input className="email" />
      <input className="send" />
    </div>
  );
};

export default SubscriptionSmall;
