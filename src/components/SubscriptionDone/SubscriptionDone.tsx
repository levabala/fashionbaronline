import './SubscriptionDone.scss';

import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
import CloseIcon from '../CloseIcon';
import TextWithCompanyName from '../TextWithCompanyName';

const SubscriptionDone = ({
  visible,
  closeCallback
}: {
  visible: boolean;
  closeCallback: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={classNames("subscriptionWrapper", visible ? "visible" : "")}
    >
      <Card>
        <div className={classNames("subscriptionDone")}>
          <div className="header">{t("subscriptionDone.title")}</div>
          <div className="message">
            <p>
              {TextWithCompanyName(
                t("subscriptionDone.main", { returnObjects: true })
              )}
            </p>
            <p>{t("subscriptionDone.ps")}</p>
          </div>
          <CloseIcon className="closeIcon" onClick={closeCallback} />
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionDone;
