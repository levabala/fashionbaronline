import './Header.scss';

import React from 'react';

import CompanyName from '../CompanyName';
import LanguageSelector from './LanguageSelector';
import TableOfContents from './TableOfContents';

const Header = ({
  absolute,
  noWoman,
  onlyWoman
}: {
  absolute?: boolean;
  noWoman?: boolean;
  onlyWoman?: boolean;
}) => {
  return (
    <div
      className={`header ${absolute ? "absolute" : ""}${
        onlyWoman ? "onlyWoman" : ""
      }`}
    >
      {noWoman ? null : (
        <img
          src="/assets/images/woman1Corrected.png"
          className="woman1"
          alt="womanOne"
        />
      )}
      {/* <div
        className="woman1"
        style={{
          background: "url(/assets/images/woman1Corrected.png) no-repeat 0 100%"
        }}
      /> */}

      <CompanyName />
      <TableOfContents />
      <LanguageSelector />
    </div>
  );
};

export default Header;
