import './FashionGrid.scss';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import TagEnum from '../../types/TagEnum';
import StyleVariables from '../../variables.scss';
import Button from '../Button';
import Price from '../Price';
import ViewBlock from '../ViewBlock';

const rawImageProportions = 691 / 557;

const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);
const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fashionElemHeightMin = parseFloat(StyleVariables.fashionElemHeightMin);
const fashionElemWidthMin = parseFloat(StyleVariables.fashionElemWidthMin);
const appPaddingHorizontalMobile = parseFloat(
  StyleVariables.appPaddingHorizontalMobile
);
const fashionElemWidthNotWideMin = parseFloat(
  StyleVariables.fashionElemWidthNotWideMin
);
const fashionElemHeightNotWideMin = parseFloat(
  StyleVariables.fashionElemHeightNotWideMin
);
const fashionGridPadding = parseFloat(StyleVariables.fashionGridPadding);
const fashionGridPaddingMobile = parseFloat(
  StyleVariables.fashionGridPaddingMobile
);

const fashionElemHeightMinMobile = parseFloat(
  StyleVariables.fashionElemHeightMinMobile
);
const fashionElemSizeMinMobile = parseFloat(
  StyleVariables.fashionElemWidthMinMobile
);

const mobile = window.innerWidth < mobileVersionMaxWidth;
const wide = window.innerWidth >= wideDisplayMinWidth;

const containerSize = mobile
  ? {
      height: window.innerHeight,
      width: window.innerWidth
    }
  : {
      height:
        window.innerHeight -
        (mobile ? fashionGridPaddingMobile : fashionGridPadding) * 2,
      width: window.innerWidth - appPaddingHorizontalMobile * 2
    };

const imageHeight = mobile
  ? fashionElemHeightMinMobile
  : wide
  ? fashionElemHeightMin
  : fashionElemHeightNotWideMin;

const imagesPerBlockVertical = Math.floor(containerSize.height / imageHeight);

const imageWidth = mobile
  ? fashionElemSizeMinMobile
  : Math.max(
      wide ? fashionElemWidthMin : fashionElemWidthNotWideMin,
      imageHeight
    );

const imagesPerBlockHorizontal = Math.floor(containerSize.width / imageWidth);

const imageContainerWidth = containerSize.width / imagesPerBlockHorizontal;
const imageContainerHeight = containerSize.height / imagesPerBlockVertical;

const imagesPerBlockTotal = imagesPerBlockHorizontal * imagesPerBlockVertical;
const imagesCount = imagesPerBlockTotal * 2; // (mobile ? 2 : 1);

console.log({ mobile, wide });
console.log(`${imageWidth}x${imageHeight}`);
console.log(`${imageContainerWidth}x${imageContainerHeight}`);
console.log(`${imagesPerBlockHorizontal}x${imagesPerBlockVertical}`);

const realImageProportions = imageContainerWidth / imageContainerHeight;
const fitToWidth = rawImageProportions <= realImageProportions;

interface BagData {
  id: string;
  brandName: string;
  nameOfModel: string;
  price: number;
}

const FashionGrid = ({
  id,
  onLoadCallback
}: {
  id: string;
  onLoadCallback: () => void;
}) => {
  const { t } = useTranslation();
  const [bags, setBags] = useState<
    Array<{ name: string; image: string; model: string }>
  >([]);
  const [costs, setCosts] = useState<{ [id: string]: number }>({});

  const bookingLabel = t("fashionGrid.booking");

  const goToBooking = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    document.body.classList.add(".needToScroll");
    (window as any).scrollTo(TagEnum.Subscribe);

    const { bagindex: bagIndexRaw } = event.currentTarget.dataset;
    const bagIndex = parseInt(
      (bagIndexRaw || 0) >= 0 ? bagIndexRaw || "0" : "-1",
      10
    );

    (window as any).choosenBag = bagIndex === -1 ? undefined : bags[bagIndex];

    const callback = () => {
      const bottomEmailInput = document.querySelector(
        ".subscriptionBig .subscriptionBlock .email"
      ) as HTMLDivElement;
      bottomEmailInput.focus();

      document.removeEventListener("keydown", callback);
    };

    document.addEventListener("keydown", callback);
  };

  const onTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget.matches(":hover, :active"))
      event.currentTarget.classList.add("clickable");
    else event.currentTarget.classList.remove("clickable");
  };

  useEffect(() => {
    onLoadCallback();
    const fetchData = async () => {
      try {
        const bagsToLoad: Array<{
          name: string;
          image: string;
        }> = await (await fetch(`/bags?count=${imagesCount}`)).json();
        // console.log(bagsToLoad);

        const bagsInfoData: BagData[] = await (await fetch(`/bagsInfo`)).json();
        console.log(bagsInfoData);

        const costsData = bagsToLoad.reduce(
          (acc: Record<string, number>, val) => ({
            ...acc,
            [val.image]: (
              bagsInfoData.find(bag => val.image.includes(bag.id)) || {
                price: 5000
              }
            ).price
          }),
          {}
        );

        console.log(bagsInfoData);
        console.log(costsData);

        setCosts(costsData);
        setBags(
          bagsToLoad.map(bag => ({
            ...bag,
            model: (bagsInfoData.find(bagInfo =>
              bag.image.includes(bagInfo.id)
            ) as BagData).nameOfModel
          }))
        );
      } catch (e) {
        console.warn(e);
      }
    };

    fetchData();
  }, []);

  const elements = new Array(imagesCount).fill(null).map((_, i) => (
    <div key={i} className={`elem`}>
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
          {(i + 1) % imagesPerBlockTotal === 0 ? (
            <div className="top">{t("fashionGrid.lastLabel")}</div>
          ) : (
            <div className="top">
              <div className="name">
                {bags[i] ? bags[i].name : "Brend Name"}
              </div>
              <div className="model">
                Model: {bags[i] ? bags[i].model : "Model Name"}
              </div>
              <div className="details">
                <div className="priceRetail">
                  {t("fashionGrid.retailPrice")}:{" "}
                  <Price
                    noMonth
                    customCost={costs[(bags[i] || { image: "" }).image] || 5000}
                    noBold
                  />
                </div>
                <div className="priceSubsription">
                  {t("fashionGrid.subscription")}: <Price noBold />
                </div>
              </div>
            </div>
          )}
          <div className="bottom">
            <div className="bookWrapper">
              <Button className="book" onClick={goToBooking} data-bagindex={i}>
                {bookingLabel}
              </Button>
            </div>
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
        <ViewBlock key={`group_${i}`} around id={id}>
          <div className="fashionGrid" style={cssVariables}>
            {group}
          </div>
        </ViewBlock>
      ))}
    </>
  );
};

export default FashionGrid;
