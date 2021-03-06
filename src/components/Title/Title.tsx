import './Title.scss';

import classnames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import getTextWidth from '../../assemblies/measureText';
import StyleVariables from '../../variables.scss';
import TextWithInsertions from '../TextWithInsertions';

const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);
const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const mobileSmallVersionMaxHeight = parseFloat(
  StyleVariables.mobileSmallVersionMaxHeight
);
const mobileExtraSmallVersionMaxHeight = parseFloat(
  StyleVariables.mobileExtraSmallVersionMaxHeight
);

const wide = window.innerWidth > wideDisplayMinWidth;
const mobile = window.innerWidth < mobileVersionMaxWidth;
const smallMobile = mobile && window.innerHeight < mobileSmallVersionMaxHeight;
const extraSmallMobile =
  smallMobile && window.innerHeight < mobileExtraSmallVersionMaxHeight;

const fontSize = extraSmallMobile
  ? 16
  : smallMobile
  ? 25
  : mobile
  ? 30
  : wide
  ? 45
  : 30;

function splitToFillLastLine(
  chunks: string[],
  maxWidth: number,
  font: string = `bold ${fontSize}px Playfair Display, serif`
): string[][] {
  const reversedChunks = chunks.slice().reverse();
  const lines = reversedChunks.reduce(
    (acc: string[][], chunk) => {
      const lastLine = acc[acc.length - 1];
      const lastLineNew = [...lastLine, chunk];
      const { width } = getTextWidth(lastLineNew.join(" "), font);

      return width < maxWidth
        ? [...acc.slice(0, -1), lastLineNew]
        : [...acc, [chunk]];
    },
    [[]]
  );

  return lines
    .slice()
    .reverse()
    .map(line => line.slice().reverse());
}

function generateBrends(
  brendsArr: string[],
  offsetWidth: number
): JSX.Element[] {
  const brendsWithComma = brendsArr.map((chunk, i2, arr2) =>
    i2 === arr2.length - 1 ? chunk : chunk + ","
  );

  return splitToFillLastLine(brendsWithComma, offsetWidth).map((line, i) => (
    <div key={i}>
      {line.map((chunk, ii) => (
        <span key={ii} className={`${line.length === 1 ? "alone" : 0}`}>
          {chunk}
        </span>
      ))}
    </div>
  ));
}

const Title = () => {
  const { t } = useTranslation();

  const getBrends = useCallback(
    () => t("title.brends", { returnObjects: true }) as string[],
    [t]
  );

  const [brendsJXS, setBrendsJXS] = useState<JSX.Element[] | null>(null);
  const [maxWidth, setMaxWidth] = useState(0);

  const update = useCallback(
    (offsetWidth: number) => {
      const brends = generateBrends(getBrends(), offsetWidth);

      setBrendsJXS(brends);
    },
    [getBrends]
  );

  useEffect(() => {
    console.log("update updated");
    setTimeout(() => {
      const id = setInterval(() => {
        const brendsElem = document.querySelector(
          ".title .brends"
        ) as HTMLDivElement | null;

        const offsetWidth = brendsElem
          ? brendsElem.getBoundingClientRect().width
          : 0;
        if (offsetWidth) {
          update(offsetWidth);
          clearInterval(id);
        }
      });
    }, 100);
  }, [update]);

  useEffect(() => {
    const brendsDiv = document.querySelector(".brends") as
      | HTMLDivElement
      | undefined;
    if (!brendsDiv) return;

    const spans = brendsDiv.querySelectorAll("span");
    if (!spans.length) return;

    const lastSpan = spans[spans.length - 1];

    const newMaxWidth =
      lastSpan.offsetLeft + lastSpan.offsetWidth - brendsDiv.offsetLeft;
    setMaxWidth(newMaxWidth);
  }, [brendsJXS]);

  return (
    <div className="title inheritMonthFontSize">
      <div className="brends">{brendsJXS}</div>
      <div
        className={classnames("feature", !maxWidth ? "hidden" : "")}
        style={
          mobile
            ? {}
            : {
                width: `${maxWidth}px`
              }
        }
      >
        {TextWithInsertions(t("title.feature", { returnObjects: true }))}
      </div>
    </div>
  );
};

export default Title;
