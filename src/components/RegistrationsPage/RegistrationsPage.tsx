import { addDays } from 'date-fns';
import Cookies from 'js-cookie';
import { sha256 } from 'js-sha256';
import React, { useCallback, useEffect, useState } from 'react';

import Button from '../Button';
import Plot from './Plot';
import Table from './Table';

export interface RegistrationData {
  email: string;
  date: string;
  location: string;
  choosenBagName?: string;
  choosenBagImage?: string;
}

const RegistrationsPage = () => {
  console.log("reeembo");
  const [registrations, setRegistrations] = useState([] as RegistrationData[]);
  const [allowed, setAllowed] = useState(false);

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
          choosenBagImage: dd[4],
          choosenBagName: dd[3],
          date: dd[1],
          email: dd[0],
          location: dd[2]
        } as RegistrationData;
      });

      console.log(registrationsRaw);

      setRegistrations(rr);
      setAllowed(true);
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

  const minR = 30;
  const minS = 5;
  const minV = 100;
  const noize = 5;
  const growPerDay = 0.5;
  const sinCoeff1 = 10;
  const sinCoeff2 = 6;

  function f(min: number, i: number): number {
    return Math.floor(
      min +
        (Math.random() - 0.5) * noize +
        growPerDay * i +
        sinCoeff2 * Math.sin(i / sinCoeff1)
    );
  }

  const registrationsData: Array<{
    time: Date;
    registrations: number;
    visits: number;
    subscriptions: number;
  }> = new Array(130).fill(null).map((_, i, arr) => ({
    registrations: f(minR, i),
    subscriptions: f(minS, i),
    time: addDays(Date.now(), i - arr.length),
    visits: f(minV, i)
  }));

  return (
    <div style={{ padding: "1em", visibility: allowed ? "visible" : "hidden" }}>
      <Button onClick={onExportButtonClick}>Export</Button>
      <Plot data={registrationsData} />
      <div style={{ marginTop: "1em" }}>
        <Table registrations={registrations} />
      </div>
    </div>
  );
};

export default RegistrationsPage;
