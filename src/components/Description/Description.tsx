import './Description.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TagEnum from '../../types/TagEnum';
import BlockHeader from '../BlockHeader';
import CompanyName from '../CompanyName';
import TextWithCompanyName from '../TextWithCompanyName';

const Description = (props: { style?: React.CSSProperties }) => {
  const { t } = useTranslation();
  const paragraphs: string[][] = t("description", { returnObjects: true });

  return (
    <div className="description" id={TagEnum.About} {...props}>
      <BlockHeader>
        <CompanyName />
      </BlockHeader>
      {paragraphs.map((paragraph, i) => (
        <p key={`paragraph${i}`}>{TextWithCompanyName(paragraph)}</p>
      ))}
    </div>
  );
};

export default Description;
