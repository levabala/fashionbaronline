import './Price.scss';

import React from 'react';

import { VariablesContainer } from '../../App';

const Price = ({ noMonth }: { noMonth?: boolean }) => {
  const { subscriptionCost } = VariablesContainer.useContainer();

  return (
    <span className="price">
      <b>{subscriptionCost} €</b>
      {noMonth ? "" : "/month"}
    </span>
  );
};

export default Price;
