import './SubscriptionDone.scss';

import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
import CloseIcon from '../CloseIcon';
import TextWithCompanyName from '../TextWithInsertions';
import { PWrapper } from '../TextWithInsertions/TextWithInsertions';

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
      <Card noPadding>
        <div className="subscriptionDone">
          <div className="left">
            <img src="/assets/images/follow-subscriptionDone.jpg" alt="a bag" />
          </div>
          <div className="right">
            <div className="sc_header">
              {TextWithCompanyName(
                t("subscriptionDone.title", { returnObjects: true })
              )}
            </div>
            <div className="message">
              {TextWithCompanyName(
                t("subscriptionDone.main", { returnObjects: true }),
                PWrapper
              )}
              <p>
                {TextWithCompanyName(
                  t("subscriptionDone.ps", { returnObjects: true })
                )}
              </p>
            </div>
            <CloseIcon className="closeIcon" onClick={closeCallback} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionDone;
