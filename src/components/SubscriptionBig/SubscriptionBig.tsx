import './SubscriptionBig.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
import SubscriptionBlock from '../SubscriptionBlock';

// const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

const Variant = ({ cost, target }: { cost: number; target: string }) => {
  const { t } = useTranslation();

  return (
    <span className="variant">
      <span className="costContainer">
        <span className="amount">{cost}</span>
        <span className="unit">€</span>
        <span className="slash">/</span>
        <span className="period">{t("subscriptionBig.variants.period")}</span>
      </span>
      <span>, </span>
      <span className="target">{target}</span>
    </span>
  );
};

const SubscriptionBig = () => {
  const { t } = useTranslation();

  return (
    <Card noPadding desktopOnly>
      <div className="subscriptionBig" id="emailSubscriptionBox">
        <div className="left">
          <img src="/assets/images/follow-subscriptionBig.jpg" alt="a bag" />
        </div>
        <div className="right">
          <img
            src="/assets/images/rectFullRedThin.png"
            className="decorationImage"
            alt="justRect"
          />
          <div className="subTitle">
            <div className="main">{t("subscriptionBig.title.main")}</div>
            {/* <div className="secondary">
            {t("subscriptionBig.title.secondary")}
          </div> */}
          </div>
          <div className="variants alone">
            <Variant cost={199} target={t("subscriptionBig.variants.first")} />
            {/* <span className="separator">
            <span>{"&"}</span>
          </span>
          <Variant cost={250} target={t("subscriptionBig.variants.second")} /> */}
          </div>
          <div className="bottomBlock">
            <SubscriptionBlock />
            <div className="smallText">{t("subscriptionBig.smallText")}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionBig;
