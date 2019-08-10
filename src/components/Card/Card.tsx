import './Card.scss';

import React from 'react';

const Card = ({ children: child }: { children: JSX.Element }) => {
  const withCardClass: JSX.Element = {
    ...child,
    props: {
      ...child.props,
      className: "card " + (child.props.className || "")
    }
  };
  return <>{withCardClass}</>;
};

export default Card;
