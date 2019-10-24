import './SavingWidget.scss';

import React from 'react';

import { SavingInfo } from '../BagsPage';

const SavingWidget = () => {
  const { saving } = SavingInfo.useContainer();

  return (
    <div className="savingWidget">
      <div className="wrapper">
        {saving ? (
          <div className="content saving">saving...</div>
        ) : (
          <div className="content done">done</div>
        )}
      </div>
    </div>
  );
};

export default SavingWidget;
