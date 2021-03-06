import './Table.scss';

import { format } from 'date-fns';
import React from 'react';

import Button from '../../Button';
import { RegistrationData } from '../RegistrationsPage';

const Table = ({ registrations }: { registrations: RegistrationData[] }) => {
  return (
    <div className="table">
      {registrations.map(
        (
          { date, location, email, choosenBagName, choosenBagImage, verified },
          i
        ) => (
          <React.Fragment key={i}>
            <div className="index">{i + 1}</div>
            <div className="date">{format(new Date(date), "dd.MM.yyyy")}</div>
            <div className="time">{format(new Date(date), "HH:mm")}</div>
            <div className="country">{location.split(" ")[0]}</div>
            <div className="city">{location.split(" ")[1]}</div>
            <div className="email">{email}</div>
            <div className="brend">{choosenBagName || "none"}</div>
            <div className="verification">
              {verified ? "verified" : "unverified"}
            </div>
            {choosenBagImage ? (
              <img className="image" src={choosenBagImage} alt="bag" />
            ) : (
              <div>none</div>
            )}
            <div className="removeButton">
              <Button value="Remove" />
            </div>
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default Table;
