import './Description.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import StyleVariables from '../../variables.scss';
import BlockHeader from '../BlockHeader';
import CompanyName from '../CompanyName';
import TextWithCompanyName from '../TextWithInsertions';

const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);
const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const mobileSmallVersionMaxHeight = parseFloat(
  StyleVariables.mobileSmallVersionMaxHeight
);
const mobileExtraSmallVersionMaxHeight = parseFloat(
  StyleVariables.mobileExtraSmallVersionMaxHeight
);

const mobile = window.innerWidth < mobileVersionMaxWidth;
const smallMobile = mobile && window.innerWidth < mobileSmallVersionMaxHeight;
const extraSmallMobile =
  smallMobile && window.innerWidth < mobileExtraSmallVersionMaxHeight;

const Description = (props: { style?: React.CSSProperties }) => {
  const { t } = useTranslation();
  const paragraphs: string[][] = t("description", { returnObjects: true });

  return (
    <div className="description" {...props}>
      {extraSmallMobile ? null : (
        <BlockHeader>
          <CompanyName />
        </BlockHeader>
      )}
      {paragraphs.map((paragraph, i) => (
        <p key={`paragraph${i}`}>{TextWithCompanyName(paragraph)}</p>
      ))}
    </div>
  );
};

export default Description;
