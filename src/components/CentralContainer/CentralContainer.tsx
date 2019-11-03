import './CentralContainer.scss';

import React, { forwardRef, Ref } from 'react';

// import Div100vh from 'react-div-100vh';

const CentralContainer = forwardRef(
  (
    { children }: { children: React.ReactChild[] },
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      // <Div100vh className="centralContainer" ref={ref}>
      <>{children}</>
      // </Div100vh>
    );
  }
);

export default CentralContainer;
