import './CompanyName.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

const CompanyName = () => {
  const { t } = useTranslation();
  return (
    <span className="companyName">
      <span className="name">{t("company.name")}</span>
      <span className="postfix">{t("company.postfix")}</span>
    </span>
  );
};

export default CompanyName;
