import './SubscriptionSmall.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const SubscriptionSmall = () => {
  const { t } = useTranslation();

  return (
    <div className="subscriptionSmall">
      <div className="label">{t("subscriptionSmall.label")}</div>
      <TextInput placeholder="example@fashionbar.online" className="email" />
      <Button className="send">{t("subscriptionSmall.save")}</Button>
    </div>
  );
};

export default SubscriptionSmall;
