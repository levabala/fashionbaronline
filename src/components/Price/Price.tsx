import './Price.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <span className="price">
      <span
        className="cost"
        style={{ fontWeight: noBold ? "initial" : "bold" }}
      >
        €{customCost || subscriptionCost}
      </span>
      <span className="period">
        {noMonth ? "" : `${t("fashionGrid.inMonth")}`}
      </span>
    </span>
  );
};

export default Price;
