import './ViewBlock.scss';

import classnames from 'classnames';
import React, { Suspense } from 'react';

// const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

const ViewBlock = ({
  children,
  forced,
  around,
  fitContent,
  first,
  disabled,
  noAnimations,
  id,
  noSuspense
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
  fitContent?: boolean;
  first?: boolean;
  disabled?: boolean;
  noAnimations?: boolean;
  id?: string;
  noSuspense?: boolean;
}) => {
  return (
    <section
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
      {children}
    </section>
  );
  // return (
  //   <Div100vh
  //     className={classnames(
  //       "viewBlock",
  //       forced ? "forced" : "",
  //       fitContent ? "fitContent" : "",
  //       around ? "around" : "",
  //       first ? "first" : "",
  //       disabled ? "disabled" : "",
  //       noAnimations ? "noAnimations" : ""
  //     )}
  //     id={id}
  //   >
  //     {noSuspense ? (
  //       <Suspense fallback={<div>Loading ...</div>}>
  //         <div className="animationContainer">{children}</div>
  //       </Suspense>
  //     ) : (
  //       <div className="animationContainer">{children}</div>
  //     )}
  //   </Div100vh>
  // );
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
