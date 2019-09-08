import './Title.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import getTextWidth from '../../assemblies/measureText';
import StyleVariables from '../../variables.scss';

const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);

function splitToFillLastLine(
  chunks: string[],
  maxWidth: number,
  font: string = `bold ${
    window.innerWidth > wideDisplayMinWidth ? 45 : 30
  }px Playfair Display, serif`
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
  const brendsArr = t("title.brends", { returnObjects: true }) as string[];

  const [brendsJXS, setBrendsJXS] = useState<JSX.Element[] | null>(null);
  // const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  // const [loaded, setLoaded] = useState(false);

  const update = useCallback(
    (offsetWidth: number) => {
      const brends = generateBrends(brendsArr, offsetWidth);

      setBrendsJXS(brends);
    },
    [brendsArr]
  );

  useEffect(() => {
    const id = setInterval(() => {
      const brendsElem = document.querySelector(
        ".title .brends"
      ) as HTMLDivElement | null;

      const offsetWidth = brendsElem ? brendsElem.offsetWidth : 0;
      if (offsetWidth) {
        update(offsetWidth);
        clearInterval(id);
      }
    });
  }, [update]);

  return (
    <div className="title">
      <div className="brends">{brendsJXS}</div>
      <div className="feature">{t("title.feature")}</div>
    </div>
  );
};

export default Title;
