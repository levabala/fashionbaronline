import './SubscriptionDone.scss';

import classNames from 'classnames';
import React from 'react';

import Card from '../Card';
import CloseIcon from '../CloseIcon';
import CompanyName from '../CompanyName';

const SubscriptionDone = ({
  visible,
  closeCallback
}: {
  visible: boolean;
  closeCallback: () => void;
}) => {
  return (
    <div
      className={classNames("subscriptionWrapper", visible ? "visible" : "")}
    >
      <Card>
        <div className={classNames("subscriptionDone")}>
          <div className="header">Subscription</div>
          <div className="message">
            <p>
              We've got your email and we'll notify you <CompanyName /> launch
              date
            </p>
            <p>Thanks for your attention.</p>
          </div>
          <CloseIcon className="closeIcon" onClick={closeCallback} />
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionDone;
