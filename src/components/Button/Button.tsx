import './Button.scss';

import React from 'react';

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return <button {...props} />;
};

export default Button;
