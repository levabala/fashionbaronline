import './Card.scss';

import React from 'react';

const Card = ({
  children: child,
  paddingOnly
}: {
  children: JSX.Element;
  paddingOnly?: boolean;
}) => {
  const withCardClass: JSX.Element = {
    ...child,
    props: {
      ...child.props,
      className:
        `card ${paddingOnly ? "paddingOnly " : ""}` +
        (child.props.className || "")
    }
  };
  return <>{withCardClass}</>;
};

export default Card;
