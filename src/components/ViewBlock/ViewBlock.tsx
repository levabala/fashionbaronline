import './ViewBlock.scss';

import React from 'react';

const ViewBlock = ({
  children,
  forced,
  around,
  fitContent
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
  fitContent?: boolean;
}) => {
  return (
    <div
      className={`viewBlock ${forced ? "forced" : ""} ${
        fitContent ? "fitContent" : ""
      } ${around ? "around" : ""}`}
    >
      {children}
    </div>
  );
};

export default ViewBlock;
