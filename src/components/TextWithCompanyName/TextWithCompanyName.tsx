import React from 'react';

import StringWithCompanyName from '../../types/StringWithCompanyName';
import CompanyName from '../CompanyName';

const SpanWrapper = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);

const TextWithCompanyName = (
  chunks: StringWithCompanyName[],
  Wrapper = SpanWrapper,
  divider: string = ""
) => {
  return chunks.map(({ prefix, includeCompanyName, postfix }, i) => (
    <Wrapper key={i}>
      {prefix}
      {includeCompanyName ? <CompanyName /> : null}
      {postfix}
      {divider}
    </Wrapper>
  ));
};

export default TextWithCompanyName;
