import './FashionGrid.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';

const FashionGrid = () => {
  const { t } = useTranslation();
  const bookingLabel = t("fashionGrid.booking");

  const goToBooking = () => {
    (window.document.getElementById(
      "emailSubscriptionBox"
    ) as HTMLDivElement).scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };

  return (
    <div className="fashionGrid">
      {new Array(15).fill(null).map((_, i) => (
        <div key={i} className="elem">
          <div className="img" />
          <div className="placeholder">
            <div className="container">
              <div className="name">Chanel</div>
              <div className="bookWrapper">
                <Button className="book" onClick={goToBooking}>
                  {bookingLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FashionGrid;
