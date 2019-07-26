import './ViewBlock.scss';

import React from 'react';

const ViewBlock = ({
  children,
  forced,
  around
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
}) => {
  return (
    <div
      className={`viewBlock ${forced ? "forced" : ""} ${
        around ? "around" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default ViewBlock;
