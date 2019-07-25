import './LanguageSelector.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [dropDownVisible, setDropDownVisibility] = useState(false);

  const changeLanguage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(event.currentTarget.dataset.code);
    i18n.changeLanguage(event.currentTarget.dataset.code || "en");
  };

  const options: Array<{ code: string; value: string }> = [
    {
      code: "en",
      value: "English"
    },
    {
      code: "zh",
      value: "Chinese"
    }
  ];

  const triggerVisibility = () => setDropDownVisibility(!dropDownVisible);
  const makeInvisible = () => setDropDownVisibility(false);

  return (
    <div className="languageSelector">
      <div className="wrapper">
        <div className="currentLanguage">
          <button onClick={triggerVisibility}>
            {
              (
                options.find(({ code }) => code === i18n.language) || {
                  value: "English"
                }
              ).value
            }
          </button>
        </div>
        <div className={`dropdownWrapper ${dropDownVisible ? "visible" : ""}`}>
          <div className="languageOptions" onMouseLeave={makeInvisible}>
            {options.map(({ code, value }) => (
              <button
                key={value}
                data-code={code}
                onClick={changeLanguage}
                className={`${i18n.language === code ? "selected" : ""}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
