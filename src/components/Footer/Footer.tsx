import './Footer.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import BlockHeader from '../BlockHeader';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <div className="contacts">
        <BlockHeader>
          <div className="label">{t("footer.contacts.lable")}</div>
        </BlockHeader>
        <div className="info">
          <span className="mail">{t("footer.contacts.mail")}</span>
          <span className="value">info@fashionbar.online</span>
          <span className="address">{t("footer.contacts.address")}</span>
          <span className="value">Nelly Sasshe Strahss 12</span>
        </div>
      </div>
      <div className="social">
        <BlockHeader>
          <div className="label">{t("footer.social.lable")}</div>
        </BlockHeader>
        <div className="info">
          <a
            className="link"
            href="https://www.instagram.com/fashionbar.online/"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
