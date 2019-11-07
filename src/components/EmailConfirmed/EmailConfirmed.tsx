import './EmailConfirmed.scss';

import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
import CloseIcon from '../CloseIcon';

const EmailConfirmed = () => {
  const { t } = useTranslation();

  const [closed, setClosed] = useState(false);
  const closeCallback = useCallback(() => setClosed(true), []);

  const visible = (window as any).emailConfirmedBoxVisible && !closed;

  return (
    <div
      className="emailConfirmedWrapper"
      style={{ display: visible ? "flex" : "none" }}
    >
      <Card>
        <div className="emailConfirmed">
          <div>
            <h1>{t("emailConfirmed.header")}</h1>
            <p>{t("emailConfirmed.main")}</p>
          </div>
          <CloseIcon className="closeIcon" onClick={closeCallback} />
        </div>
      </Card>
    </div>
  );
};

export default EmailConfirmed;
