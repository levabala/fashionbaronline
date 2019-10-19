import './Price.scss';

import React from 'react';

import { VariablesContainer } from '../../App';

const Price = ({
  noMonth,
  customCost,
  noBold
}: {
  noMonth?: boolean;
  customCost?: number;
  noBold?: boolean;
}) => {
  const { subscriptionCost } = VariablesContainer.useContainer();

  return (
    <span className="price">
      <span
        className="cost"
        style={{ fontWeight: noBold ? "initial" : "bold" }}
      >
        €{customCost || subscriptionCost}
      </span>
      <span className="period">{noMonth ? "" : " in month"}</span>
    </span>
  );
};

export default Price;
