import { sha256 } from 'js-sha256';
import React, { useEffect, useState } from 'react';

import Table from './Table';

export interface RegistrationData {
  email: string;
  date: string;
  location: string;
}

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([] as RegistrationData[]);

  useEffect(() => {
    const fetcher = async () => {
      const data = await (await fetch("auth")).json();
      const password = prompt("Enter password");
      // const password = "mytestpassword";
      const { token } = data;
      const accessToken = sha256(token + password);

      const registrationsJSON = await (await fetch("getRegistrations", {
        body: JSON.stringify({
          token: accessToken
        }),
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      })).json();

      const registrationsRaw: string[] = registrationsJSON.data
        .split("\n")
        .slice(0, -1);
      const rr: RegistrationData[] = registrationsRaw.map(line => {
        const dd = line.split(",");
        return {
          date: dd[1],
          email: dd[0],
          location: dd[2]
        } as RegistrationData;
      });

      setRegistrations(rr);
    };

    fetcher();
  }, []);

  return (
    <div>
      <Table registrations={registrations} />
    </div>
  );
};

export default RegistrationsPage;
