import './Table.scss';

import React from 'react';

import { RegistrationData } from '../RegistrationsPage';

const Table = ({ registrations }: { registrations: RegistrationData[] }) => {
  return (
    <div className="table">
      {registrations.map(
        ({ date, location, email, choosenBagName, choosenBagImage }, i) => (
          <React.Fragment key={i}>
            <div className="date">{date}</div>
            <div className="location">{location}</div>
            <div className="email">{email}</div>
            <div className="brend">{choosenBagName}</div>
            <img
              className="image"
              src={choosenBagImage ? choosenBagImage : ""}
              alt="bag"
            />
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default Table;
