import './Title.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Variables from '../../../src/variables.scss';
import getTextWidth from '../../assemblies/measureText';

const mobileVersionMaxWidth = parseFloat(Variables.mobileVersionMaxWidth);

function splitToFillLastLine(
  chunks: string[],
  maxWidth: number,
  font: string = "bold 30px Playfair Display, serif"
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

function generateBrends(brendsArr: string[], offsetWidth: number): string {
  const brendsWithComma = brendsArr.map((chunk, i2, arr2) =>
    i2 === arr2.length - 1 ? chunk : chunk + ","
  );

  return window.innerWidth < mobileVersionMaxWidth
    ? brendsWithComma.map(chunk => `<span>${chunk}</span>`).join(" ")
    : splitToFillLastLine(brendsWithComma, offsetWidth)
        .map(
          line =>
            `<div>${line.map(chunk => `<span>${chunk}</span>`).join("")}</div>`
        )
        .join(" ");
}

const Title = () => {
  const { t } = useTranslation();
  const brendsArr = t("title.brends", { returnObjects: true }) as string[];

  const update = () => {
    const brendsElem = document.querySelector(
      ".title .brends"
    ) as HTMLDivElement | null;

    // tslint:disable:no-unused-expression no-object-mutation
    brendsElem &&
      (brendsElem.innerHTML = generateBrends(
        brendsArr,
        brendsElem.offsetWidth
      ));
    // tslint:enable:no-unused-expression no-object-mutation
  };

  window.addEventListener("resize", update);
  setTimeout(update);

  return (
    <div className="title">
      <div className="brends">{}</div>
      <div className="feature">{t("title.feature")}</div>
    </div>
  );
};

export default Title;
