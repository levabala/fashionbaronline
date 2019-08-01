import './TextInput.scss';

import React, { forwardRef } from 'react';

const TextInput = forwardRef(
  (
    props: React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return <input ref={ref} {...props} />;
  }
);

export default TextInput;
