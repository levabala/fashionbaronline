import { sha256 } from 'js-sha256';
import React, { useEffect, useState } from 'react';

const RegistrationsPage = () => {
  // const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    const fetcher = async () => {
      const data = await (await fetch("auth")).json();
      const password = "mytestpassword";
      const { token } = data;
      const accessToken = sha256(token + password);

      const registrations = await (await fetch("getRegistrations", {
        body: JSON.stringify({
          token: accessToken
        }),
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      })).json();

      console.log(registrations);
    };

    fetcher();
  }, []);

  return <div />;
};

export default RegistrationsPage;
