import './Description.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TagEnum from '../../types/TagEnum';
import CompanyName from '../CompanyName';
import TextWithCompanyName from '../TextWithCompanyName';

const Description = () => {
  const { t } = useTranslation();
  const paragraphs: Array<
    Array<{
      prefix: string;
      postfix: string;
      includeCompanyName: boolean;
    }>
  > = t("description", { returnObjects: true });

  return (
    <div className="description" id={TagEnum.About}>
      <CompanyName />
      {paragraphs.map((paragraph, i) => (
        <p key={`paragraph${i}`}>{TextWithCompanyName(paragraph)}</p>
      ))}
    </div>
  );
};

export default Description;
