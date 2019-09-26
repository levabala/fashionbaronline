import './FashionGrid.scss';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import StyleVariables from '../../variables.scss';
import Button from '../Button';
import Price from '../Price';
import ViewBlock from '../ViewBlock';

const rawImageProportions = 691 / 557;

const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);
const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fashionElemHeightMin = parseFloat(StyleVariables.fashionElemHeightMin);
const fashionElemWidthMin = parseFloat(StyleVariables.fashionElemWidthMin);
const fashionElemWidthNotWideMin = parseFloat(
  StyleVariables.fashionElemWidthNotWideMin
);
const fashionElemHeightNotWideMin = parseFloat(
  StyleVariables.fashionElemHeightNotWideMin
);
const fashionGridPadding = parseFloat(StyleVariables.fashionGridPadding);

const fashionElemHeightMinMobile = parseFloat(
  StyleVariables.fashionElemHeightMinMobile
);
const fashionElemSizeMinMobile = parseFloat(
  StyleVariables.fashionElemWidthMinMobile
);

const containerSize = {
  height: window.innerHeight - fashionGridPadding * 2,
  width: window.innerWidth - fashionGridPadding * 2
};

const mobile = containerSize.width < mobileVersionMaxWidth;
const notWide = containerSize.width > wideDisplayMinWidth;

const imageWidth = mobile
  ? fashionElemSizeMinMobile
  : notWide
  ? fashionElemWidthMin
  : fashionElemWidthNotWideMin;
const imageHeight = mobile
  ? fashionElemHeightMinMobile
  : notWide
  ? fashionElemHeightMin
  : fashionElemHeightNotWideMin;

const imagesPerBlockHorizontal = Math.floor(containerSize.width / imageWidth);
const imagesPerBlockVertical = Math.floor(containerSize.height / imageHeight);

const imageContainerWidth = containerSize.width / imagesPerBlockHorizontal;
const imageContainerHeight = containerSize.height / imagesPerBlockVertical;

const imagesPerBlockTotal = imagesPerBlockHorizontal * imagesPerBlockVertical;
const imagesCount = imagesPerBlockTotal * (mobile ? 2 : 1);

console.log(`${imageContainerWidth}x${imageContainerHeight}`);
console.log(`${imagesPerBlockHorizontal}x${imagesPerBlockVertical}`);

const realImageProportions = imageContainerWidth / imageContainerHeight;
const fitToWidth = rawImageProportions <= realImageProportions;

const FashionGrid = ({
  renderCallback,
  id
}: {
  renderCallback: () => void;
  id: string;
}) => {
  const { t } = useTranslation();
  const [bags, setBags] = useState<Array<{ name: string; image: string }>>([]);

  const bookingLabel = t("fashionGrid.booking");

  const goToBooking = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    (window as any).scrollPage(1);

    const { bagindex: bagIndexRaw } = event.currentTarget.dataset;
    const bagIndex = parseInt(
      (bagIndexRaw || 0) >= 0 ? bagIndexRaw || "0" : "-1",
      10
    );

    (window as any).choosenBag = bagIndex === -1 ? undefined : bags[bagIndex];
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
        // console.log(bagsToLoad);

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
        {bags[i] ? (
          <LazyLoadImage
            src={bags[i].image}
            visibleByDefault
            className={fitToWidth ? "fitToWidth" : ""}
          />
        ) : null}
      </div>
      <div className="placeholder" onTransitionEnd={onTransitionEnd}>
        <div className="black" />
        <div className="container">
          <div className="name">{bags[i] ? bags[i].name : "Brend Name"}</div>
          <div className="details">
            <div className="priceRetail">retail Pirce: 5000$</div>
            <div className="priceSubsription">
              subscription: <Price />
            </div>
          </div>
          <div className="bookWrapper">
            <Button className="book" onClick={goToBooking} data-bagindex={i}>
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

  const blocks = elements
    .reduce(
      (acc: JSX.Element[][], val) => {
        return acc[acc.length - 1].length < imagesPerBlockTotal
          ? [...acc.slice(0, -1), [...acc[acc.length - 1], val]]
          : [...acc, [val]];
      },
      [[]]
    )
    .filter(block => block.length === imagesPerBlockTotal);

  return (
    <>
      {blocks.map((group, i) => (
        <ViewBlock key={`group_${i}`} around id={i === 0 ? id : ""}>
          <div className="fashionGrid" style={cssVariables}>
            {group}
          </div>
        </ViewBlock>
      ))}
    </>
  );
};

export default FashionGrid;
