import './Title.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

const Title = () => {
  const { t } = useTranslation();

  return (
    <div className="title">
      <div className="brends">
        {(t("title.brends", { returnObjects: true }) as string[]).join(", ")}
      </div>
      <div className="feature">{t("title.feature")}</div>
    </div>
  );
};

export default Title;
