import './Button.scss';

import React from 'react';

const Button = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return <button className="button" {...props} />;
};

export default Button;
