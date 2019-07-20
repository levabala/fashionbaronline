import './Features.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TagEnum from '../../types/TagEnum';
import TextWithCompanyName from '../TextWithCompanyName';

const LiWrapper = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

const Features = () => {
  const { t } = useTranslation();
  const features: string[] = t("features", {
    returnObjects: true
  });

  return (
    <div className="features" id={TagEnum.Social}>
      <ol>{TextWithCompanyName(features, LiWrapper)}</ol>
    </div>
  );
};

export default Features;
