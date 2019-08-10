import './CentralContainer.scss';

import React, { forwardRef, Ref } from 'react';

const CentralContainer = forwardRef(
  (
    { children }: { children: React.ReactChild[] },
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div className="centralContainer" ref={ref}>
        {children}
      </div>
    );
  }
);

export default CentralContainer;
