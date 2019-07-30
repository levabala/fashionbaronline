import './FashionGrid.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import StyleVariables from '../../variables.scss';
import Button from '../Button';
import ViewBlock from '../ViewBlock';

// const appPaddingVertical = parseFloat(StyleVariables.appPaddingVertical);
const fashionElemSizeMinMobile = parseFloat(
  StyleVariables.fashionElemSizeMinMobile
);

const imagesCount = 25;
const containerSize = {
  height: window.innerHeight,
  width: window.innerWidth
};

const imagesPerBlockHorizontal = Math.floor(
  containerSize.width / fashionElemSizeMinMobile
);
const imagesPerBlockVertical = Math.floor(
  containerSize.height / fashionElemSizeMinMobile
);

const imagesPerBlockTotal = imagesPerBlockHorizontal * imagesPerBlockVertical;

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

  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget.matches(":hover, :active"))
      event.currentTarget.classList.add("clickable");
    else event.currentTarget.classList.remove("clickable");
  };

  const elements = new Array(imagesCount).fill(null).map((_, i) => (
    <div key={i} className="elem">
      <div className="img" />
      <div className="placeholder" onTransitionEnd={onTransitionEnd}>
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
  ));

  return (
    <>
      {elements
        .reduce(
          (acc: JSX.Element[][], val) => {
            return acc[acc.length - 1].length < imagesPerBlockTotal
              ? [...acc.slice(0, -1), [...acc[acc.length - 1], val]]
              : [...acc, [val]];
          },
          [[]]
        )
        .map((group, i) => (
          <ViewBlock key={`group_${i}`} around disabled={i !== 0}>
            <div className="fashionGrid">{group}</div>
          </ViewBlock>
        ))}
    </>
  );
};

export default FashionGrid;
