import './Features.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TextWithCompanyName from '../TextWithInsertions';

const LiWrapper = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

const Features = () => {
  const { t } = useTranslation();
  const features: string[] = t("features", {
    returnObjects: true
  });

  return (
    <div className="features">
      <ol>{TextWithCompanyName(features, LiWrapper)}</ol>
      <img src="/assets/images/woman2.png" className="woman" alt="womanTwo" />
    </div>
  );
};

export default Features;
