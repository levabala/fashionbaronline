import './LanguageSelector.scss';

import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  // const [dropDownVisible, setDropDownVisibility] = useState(false);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // makeInvisible();
    changeLanguage(event);
  };

  const changeLanguage = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    console.log(event.currentTarget.dataset.code);
    const lang = event.currentTarget.dataset.code || "en";
    i18n.changeLanguage(lang);
    Cookies.set("language", lang);
  };

  const options: Array<{ code: string; value: string }> = [
    {
      code: "en",
      value: "English"
    },
    {
      code: "zh",
      value: "Chinese"
    },
    {
      code: "de",
      value: "German"
    },
    {
      code: "es",
      value: "Spanish"
    }
  ];

  // const triggerVisibility = () => setDropDownVisibility(!dropDownVisible);
  // const makeInvisible = () => setDropDownVisibility(false);

  const orderedLanguages = [
    options.find(({ code }) => code === i18n.language) || {
      code: "en",
      value: "English"
    }
  ].concat(options.filter(({ code }) => code !== i18n.language));

  return (
    <div className="languageSelector">
      <div className="wrapper">
        <ul
          className="languagepicker large roundborders"
          // style={{ "--rows-count": options.length } as React.CSSProperties}
        >
          {orderedLanguages.map(({ code, value }) => (
            <a href="#nl" key={code} onClick={onClick} data-code={code}>
              <li>{value}</li>
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSelector;
