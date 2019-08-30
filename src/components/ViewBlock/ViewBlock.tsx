import './ViewBlock.scss';

import classnames from 'classnames';
import React from 'react';
import Div100vh from 'react-div-100vh';

// const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

const ViewBlock = ({
  children,
  forced,
  around,
  fitContent,
  first,
  disabled,
  noAnimations,
  id
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
  fitContent?: boolean;
  first?: boolean;
  disabled?: boolean;
  noAnimations?: boolean;
  id?: string;
}) => {
  return (
    <Div100vh
      className={classnames(
        "viewBlock",
        forced ? "forced" : "",
        fitContent ? "fitContent" : "",
        around ? "around" : "",
        first ? "first" : "",
        disabled ? "disabled" : "",
        noAnimations ? "noAnimations" : ""
      )}
      id={id}
    >
      <div className="animationContainer">{children}</div>
    </Div100vh>
  );
  // return window.innerWidth > mobileVersionMaxWidth ? (
  //   <Div100vh
  //     className={classnames(
  //       "viewBlock",
  //       forced ? "forced" : "",
  //       fitContent ? "fitContent" : "",
  //       around ? "around" : "",
  //       first ? "first" : "",
  //       disabled ? "disabled" : ""
  //     )}
  //   >
  //     <div className="animationContainer">{children}</div>
  //   </Div100vh>
  // ) : (
  //   <div
  //     className={classnames(
  //       "viewBlock",
  //       forced ? "forced" : "",
  //       fitContent ? "fitContent" : "",
  //       around ? "around" : "",
  //       first ? "first" : "",
  //       disabled ? "disabled" : ""
  //     )}
  //   >
  //     <div className="animationContainer">{children}</div>
  //   </div>
  // );
};

export default ViewBlock;
