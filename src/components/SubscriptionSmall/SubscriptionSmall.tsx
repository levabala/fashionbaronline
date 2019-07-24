import './SubscriptionSmall.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const SubscriptionSmall = () => {
  const { t } = useTranslation();

  const onSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.persist();
    console.log(event);
  };

  return (
    <form className="subscriptionSmall" onSubmit={onSend} action="#">
      <div className="label">{t("subscriptionSmall.label")}</div>
      <TextInput placeholder="example@fashionbar.online" className="email" />
      <Button className="send" type="submit">
        {t("subscriptionSmall.save")}
      </Button>
    </form>
  );
};

export default SubscriptionSmall;
