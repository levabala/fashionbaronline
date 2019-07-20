import './BlockHeader.scss';

import React from 'react';

const BlockHeader = ({ children }: { children: React.ReactChild }) => {
  return <div className="blockHeader">{children}</div>;
};

export default BlockHeader;
