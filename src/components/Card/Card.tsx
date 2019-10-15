import './Card.scss';

import React from 'react';

import StyleVariables from '../../variables.scss';

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

const Card = ({
  children: child,
  paddingOnly,
  noPadding,
  desktopOnly
}: {
  children: JSX.Element;
  paddingOnly?: boolean;
  noPadding?: boolean;
  desktopOnly?: boolean;
}) => {
  const mobile = window.innerWidth <= mobileVersionMaxWidth;

  const withCardClass: JSX.Element = {
    ...child,
    props: {
      ...child.props,
      className:
        `card ${paddingOnly ? "paddingOnly " : ""} ${
          noPadding ? "noPadding " : ""
        }` + (child.props.className || "")
    }
  };

  return desktopOnly && mobile ? child : withCardClass;
};

export default Card;
