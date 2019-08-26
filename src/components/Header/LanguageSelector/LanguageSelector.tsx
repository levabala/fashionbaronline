import './LanguageSelector.scss';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [dropDownVisible, setDropDownVisibility] = useState(false);

  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    makeInvisible();
    changeLanguage(event);
  };

  const changeLanguage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log(event.currentTarget.dataset.code);
    i18n.changeLanguage(event.currentTarget.dataset.code || "en");
  };

  const options: Array<{ code: string; value: string }> = [
    {
      code: "en",
      value: "eng"
    },
    {
      code: "zh",
      value: "chin"
    },
    {
      code: "de",
      value: "germ"
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
            {options
              .filter(({ code }) => code !== i18n.language)
              .map(({ code, value }) => (
                <button
                  key={value}
                  data-code={code}
                  onClick={onClick}
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
