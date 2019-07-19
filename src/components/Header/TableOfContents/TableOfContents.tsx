import './TableOfContents.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TagEnum from '../../../types/TagEnum';

const table = Object.values(TagEnum);

const TableOfContents = () => {
  const { t } = useTranslation();

  return (
    <div className="tableOfContents">
      {table.map(name => (
        <span key={name} className="tag">
          <a href={`#${name}`}>{t(`tableOfContents.${name}`)}</a>
        </span>
      ))}
    </div>
  );
};

export default TableOfContents;
