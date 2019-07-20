import './LanguageSelector.scss';

import React from 'react';

const LanguageSelector = () => {
  // const { i18n } = useTranslation();

  // const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   i18n.changeLanguage(event.target.value);
  // };

  return (
    // <select className="languageSelector" onChange={changeLanguage}>
    //   <option value="en">English</option>
    //   <option value="zh">Traditional Chinese</option>
    // </select>
    <div className="languageSelector">
      <span>english</span>
    </div>
  );
};

export default LanguageSelector;
