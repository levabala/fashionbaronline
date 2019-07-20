import './SubscriptionBig.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const Variant = ({ cost, target }: { cost: number; target: string }) => {
  const { t } = useTranslation();

  return (
    <span className="variant">
      <div className="costContainer">
        <span className="amount">{cost}</span>
        <span className="unit">€</span>
        <span className="slash">/</span>
        <span className="period">{t("subscriptionBig.variants.period")}</span>
      </div>
      <div className="target">{target}</div>
    </span>
  );
};

const SubscriptionBig = () => {
  const { t } = useTranslation();

  const clickHandler = () => {
    console.log("click");
  };

  return (
    <div className="subscriptionBig">
      <div className="subTitle">
        <div className="main">{t("subscriptionBig.title.main")}</div>
        <div className="secondary">{t("subscriptionBig.title.secondary")}</div>
      </div>
      <div className="variants">
        <Variant cost={125} target={t("subscriptionBig.variants.first")} />
        <span className="separator">
          <span>{"&"}</span>
        </span>
        <Variant cost={250} target={t("subscriptionBig.variants.second")} />
      </div>
      <div className="sendBox">
        <TextInput placeholder="example@fashionbar.online" />
        <Button onClick={clickHandler}>
          {t("subscriptionBig.sendBox.send")}
        </Button>
      </div>
      <div className="smallText">{t("subscriptionBig.smallText")}</div>
    </div>
  );
};

export default SubscriptionBig;
