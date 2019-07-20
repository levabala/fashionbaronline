import './TextInput.scss';

import React from 'react';

const TextInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return <input {...props} />;
};

export default TextInput;
