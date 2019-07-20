import React from 'react';

import CompanyName from '../CompanyName';

const SpanWrapper = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);

const TextWithCompanyName = (
  strings: string[],
  Wrapper = SpanWrapper,
  divider: string = ""
) => {
  return strings.map((str, i) => {
    const arr = str.split("<COMPANYNAME>");
    return (
      <Wrapper key={i}>
        {arr.length > 1
          ? [arr[0], <CompanyName key="companyName" />, arr[1]]
          : arr[0]}
      </Wrapper>
    );
  });
};

export default TextWithCompanyName;
