import './SubscriptionBig.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
import SubscriptionBlock from '../SubscriptionBlock';

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

  return (
    <Card>
      <div className="subscriptionBig" id="emailSubscriptionBox">
        <img
          src="/assets/images/rectFullRedThin.png"
          className="decorationImage"
          alt="justRect"
        />
        <div className="subTitle">
          <div className="main">{t("subscriptionBig.title.main")}</div>
          <div className="secondary">
            {t("subscriptionBig.title.secondary")}
          </div>
        </div>
        <div className="variants">
          <Variant cost={125} target={t("subscriptionBig.variants.first")} />
          <span className="separator">
            <span>{"&"}</span>
          </span>
          <Variant cost={250} target={t("subscriptionBig.variants.second")} />
        </div>
        <div className="bottomBlock">
          <SubscriptionBlock />
          <div className="smallText">{t("subscriptionBig.smallText")}</div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionBig;
