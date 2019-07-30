import './ViewBlock.scss';

import classnames from 'classnames';
import React from 'react';

const ViewBlock = ({
  children,
  forced,
  around,
  fitContent,
  first,
  disabled
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
  fitContent?: boolean;
  first?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={classnames(
        "viewBlock",
        forced ? "forced" : "",
        fitContent ? "fitContent" : "",
        around ? "around" : "",
        first ? "first" : "",
        disabled ? "disabled" : ""
      )}
    >
      <div className="animationContainer">{children}</div>
    </div>
  );
};

export default ViewBlock;
