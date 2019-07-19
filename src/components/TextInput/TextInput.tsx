import './TextImport.scss';

import React from 'react';

const TextInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return <input className="textImport" {...props} />;
};

export default TextInput;
