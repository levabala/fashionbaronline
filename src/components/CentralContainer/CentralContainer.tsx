import './CentralContainer.scss';

import React, { forwardRef, Ref } from 'react';

const CentralContainer = forwardRef(
  (
    { children }: { children: React.ReactChild[] },
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <main className="centralContainer" ref={ref}>
        {children}
      </main>
    );
  }
);

export default CentralContainer;
