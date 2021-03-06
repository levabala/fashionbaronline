import './TableOfContents.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import TagEnum from '../../../types/TagEnum';
import { CurrentFashionGridIndexInfo } from '../../MainPageReforgedReforged/MainPageReforgedReforged';

const table = Object.values(TagEnum);

const TableOfContents = () => {
  const { t } = useTranslation();
  const { currentIndex } = CurrentFashionGridIndexInfo.useContainer();

  const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { blockid } = event.currentTarget.dataset;
    if (!blockid) return;

    console.log(blockid);
    (window as any).scrollTo(blockid);
  };

  return (
    <nav className="tableOfContents">
      <div className="text">
        {table.map(name => (
          <span key={name} className="tag">
            <span data-blockid={name} onClick={onClick}>
              {t(`tableOfContents.${name}`)}
            </span>
          </span>
        ))}
      </div>
    </nav>
  );
};

export default TableOfContents;
