import './HorizontalLimiter.scss';

import React, { forwardRef, Ref } from 'react';

const HorizontalLimiter = forwardRef(
  (
    { children }: { children: React.ReactChild[] },
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div className="horizontalLimiter" ref={ref}>
        {children}
      </div>
    );
  }
);

export default HorizontalLimiter;
