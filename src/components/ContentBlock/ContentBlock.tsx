import './ContentBlock.scss';

import React from 'react';

const ContentBlock = ({
  children
}: {
  children: React.ReactChild[] | React.ReactChild;
}) => {
  return <div className="contentBlock">{children}</div>;
};

export default ContentBlock;
