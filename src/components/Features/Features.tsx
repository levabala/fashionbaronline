import './Features.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Card from '../Card';
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
    <Card noPadding desktopOnly>
      <div className="features">
        <span className="main">
          <ol>{TextWithCompanyName(features, LiWrapper)}</ol>
        </span>
        <span className="woman" style={{ width: 700, height: 700 }} />
        {/* <img src="/assets/images/woman2.png" className="woman" alt="womanTwo" /> */}
      </div>
    </Card>
  );
};

export default Features;
