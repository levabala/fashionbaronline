import './HorizontalLimiter.scss';

import React from 'react';

const HorizontalLimiter = ({ children }: { children: React.ReactChild[] }) => {
  return <div className="horizontalLimiter">{children}</div>;
};

export default HorizontalLimiter;
