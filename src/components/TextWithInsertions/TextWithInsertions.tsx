import React from 'react';

import CompanyName from '../CompanyName';
import Price from '../Price';

export const PWrapper = ({ children }: { children: React.ReactNode }) => (
  <p>{children}</p>
);

export const DivWrapper = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const SpanWrapper = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);

const TextWithInsertions = (strings: string[], Wrapper = SpanWrapper) => {
  return strings.map((str, i) => {
    const arr0 = str.split("<COMPANYNAME>");
    const arr = arr0.map((s, i2) => {
      const innerArr = s.split("<PRICE>");
      // console.log(innerArr);
      return innerArr.length === 1
        ? s
        : [innerArr[0], <Price key={i2} />, innerArr[1]];
    });
    return (
      <Wrapper key={i}>
        {arr.length > 1
          ? [arr[0], <CompanyName key="companyName" />, arr[1]]
          : arr[0]}
      </Wrapper>
    );
  });
};

export default TextWithInsertions;
