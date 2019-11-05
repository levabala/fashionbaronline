import './ViewBlock.scss';

import classnames from 'classnames';
import detect from 'mobile-detect';
import React, { Suspense } from 'react';

// const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);\

const os = new detect(window.navigator.userAgent).os();
const ios = os === "iOS" || os === "iPadOS";

const ViewBlock = ({
  children,
  forced,
  around,
  fitContent,
  first,
  disabled,
  noAnimations,
  id,
  noSuspense,
  noSnap
}: {
  children: React.ReactChild[] | React.ReactChild;
  forced?: boolean;
  around?: boolean;
  fitContent?: boolean;
  noSnap?: boolean;
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
        noAnimations ? "noAnimations" : "",
        noSnap ? "noSnap" : ""
      )}
      id={id}
      style={noSnap && ios ? { height: (window.innerHeight / 2) * 1.1 } : {}}
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
