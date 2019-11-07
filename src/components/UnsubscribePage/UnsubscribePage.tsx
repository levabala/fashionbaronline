import './UnsubscribePage.scss';

import React from 'react';

import Card from '../Card';

const UnsubscribePage = () => {
  return (
    <div className="unsubscribeBlockWrapper">
      <Card>
        <div className="unsubscribeBlock">
          <h1>You have been successfully unsubscribed</h1>
        </div>
      </Card>
    </div>
  );
};

export default UnsubscribePage;
