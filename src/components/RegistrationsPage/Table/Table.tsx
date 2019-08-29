import './Table.scss';

import React from 'react';

import { RegistrationData } from '../RegistrationsPage';

const Table = ({ registrations }: { registrations: RegistrationData[] }) => {
  return (
    <div className="table">
      {registrations.map(({ date, location, email }, i) => (
        <React.Fragment key={i}>
          <div className="date">{date}</div>
          <div className="location">{location}</div>
          <div className="email">{email}</div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Table;
