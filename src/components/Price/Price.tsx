import './Price.scss';

import React from 'react';

import { VariablesContainer } from '../../App';

const Price = () => {
  const { subscriptionCost } = VariablesContainer.useContainer();

  return (
    <span className="price">
      <b>{subscriptionCost}</b> €/month
    </span>
  );
};

export default Price;
