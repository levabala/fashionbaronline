import './FashionGrid.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import StyleVariables from '../../variables.scss';
import Button from '../Button';
import ViewBlock from '../ViewBlock';

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fashionElemHeightMin = parseFloat(StyleVariables.fashionElemHeightMin);
const fashionElemSizeMin = parseFloat(StyleVariables.fashionElemSizeMin);

const fashionElemHeightMinMobile = parseFloat(
  StyleVariables.fashionElemHeightMinMobile
);
const fashionElemSizeMinMobile = parseFloat(
  StyleVariables.fashionElemSizeMinMobile
);

const containerSize = {
  height: window.innerHeight,
  width: window.innerWidth
};

const mobile = window.innerWidth < mobileVersionMaxWidth;
const imagesPerBlockHorizontal = Math.floor(
  containerSize.width / (mobile ? fashionElemSizeMinMobile : fashionElemSizeMin)
);
const imagesPerBlockVertical = Math.floor(
  containerSize.height /
    (mobile ? fashionElemHeightMinMobile : fashionElemHeightMin)
);

const imagesPerBlockTotal = imagesPerBlockHorizontal * imagesPerBlockVertical;
const imagesCount = imagesPerBlockTotal;

console.log(
  `${mobile ? fashionElemSizeMinMobile : fashionElemSizeMin}x${
    mobile ? fashionElemHeightMinMobile : fashionElemHeightMin
  }`
);
console.log(`${imagesPerBlockHorizontal}x${imagesPerBlockVertical}`);

const FashionGrid = ({ renderCallback }: { renderCallback: () => void }) => {
  const { t } = useTranslation();
  const [bags, setBags] = useState<Array<{ name: string; image: string }>>([]);

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

  useEffect(() => {
    renderCallback();

    const fetchData = async () => {
      try {
        const bagsToLoad: Array<{
          name: string;
          image: string;
        }> = await (await fetch(`/bags?count=${imagesCount}`)).json();
        console.log(bagsToLoad);

        setBags(bagsToLoad);
      } catch (e) {
        console.warn(e);
      }
    };

    fetchData();
  }, [renderCallback]);

  const elements = new Array(imagesCount).fill(null).map((_, i) => (
    <div key={i} className="elem">
      <div className={`img ${bags[i] ? "withImage" : ""}`}>
        {bags[i] ? <LazyLoadImage src={bags[i].image} /> : null}
      </div>
      <div className="placeholder" onTransitionEnd={onTransitionEnd}>
        <div className="black" />
        <div className="container">
          <div className="name">{bags[i] ? bags[i].name : ""}</div>
          <div className="bookWrapper">
            <Button className="book" onClick={goToBooking}>
              {bookingLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  ));

  const cssVariables = {
    "--columns-count": imagesPerBlockVertical,
    "--rows-count": imagesPerBlockHorizontal
  } as React.CSSProperties;

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
        .filter(block => block.length === imagesPerBlockTotal)
        .map((group, i) => (
          <ViewBlock key={`group_${i}`} around disabled={i !== 0} noAnimations>
            <div className="fashionGrid" style={cssVariables}>
              {group}
            </div>
          </ViewBlock>
        ))}
    </>
  );
};

export default FashionGrid;
