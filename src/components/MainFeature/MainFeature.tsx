import './MainFeature.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TextWithCompanyName from '../TextWithCompanyName';

const MainFeature = () => {
  const { t } = useTranslation();
  return (
    <div className="mainFeature">
      <img className="funnyImage" src="/assets/images/happy.png" alt="funny" />
      <p className="feature">
        {TextWithCompanyName([t("mainFeature", { returnObjects: true })])[0]}
      </p>
    </div>
  );
};

export default MainFeature;
