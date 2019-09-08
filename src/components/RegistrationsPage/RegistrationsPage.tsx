import Cookies from 'js-cookie';
import { sha256 } from 'js-sha256';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '../Button';
import Table from './Table';

export interface RegistrationData {
  email: string;
  date: string;
  location: string;
}

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([] as RegistrationData[]);

  const fetchRegistations = useCallback(async () => {
    const data = await (await fetch("auth")).json();

    const cachedPassword = Cookies.get("password");
    const password = cachedPassword || prompt("Enter password");

    if (!cachedPassword)
      Cookies.set("password", password || "", { secure: true });

    // const password = "mytestpassword";
    const { token } = data;
    const accessToken = sha256(token + password);

    try {
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

      console.log(registrationsRaw);

      setRegistrations(rr);
    } catch (e) {
      Cookies.remove("password", { secure: true });
      fetchRegistations();
    }
  }, []);

  const onExportButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const registrationsStr = registrations
      .map(({ date, email, location }) => [date, email, location].join(", "))
      .join("\n");
    const csv = `data:text/csv;charset=utf-8,${registrationsStr}`;

    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${new Date()}.csv`);
    document.body.appendChild(link);

    link.click();
  };

  useEffect(() => {
    fetchRegistations();
  }, [fetchRegistations]);

  return (
    <div style={{ padding: "1em" }}>
      <Button onClick={onExportButtonClick}>Export</Button>
      <div style={{ marginTop: "1em" }}>
        <Table registrations={registrations} />
      </div>
    </div>
  );
};

export default RegistrationsPage;
