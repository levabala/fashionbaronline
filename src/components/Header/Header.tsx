import './Header.scss';

import React from 'react';

import CompanyName from '../CompanyName';
import LanguageSelector from './LanguageSelector';
import TableOfContents from './TableOfContents';

const Header = () => {
  return (
    <div className="header">
      <img src="/assets/images/woman1.png" className="woman1" alt="womanOne" />
      <CompanyName />
      <TableOfContents />
      <LanguageSelector />
    </div>
  );
};

export default Header;
