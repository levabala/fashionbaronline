import './RegistrationsPage.scss';

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
  unsubscribed?: boolean;
  verified?: boolean;
}

interface DayData {
  time: Date;
  registrations: number;
  visits: number;
  subscriptions: number;
}

const RegistrationsPage = () => {
  console.log("reeembo");
  const [registrationsData, setRegistrationsData] = useState(
    [] as RegistrationData[]
  );
  const [allowed, setAllowed] = useState(false);
  const [daysData, setDaysData] = useState([] as DayData[]);

  const fetchRegistations = useCallback(async () => {
    const data = await (await fetch("auth")).json();

    const cachedPassword = Cookies.get("password");
    const password = cachedPassword || prompt("Enter password");

    if (!cachedPassword)
      Cookies.set("password", password || "", { secure: true });

    // const password = "mytestpassword";
    const { token } = data;
    const accessToken = sha256(token + password);

    interface R {
      date: Date;
      email: string;
      location: {
        country: string;
        town: string;
      };
      relativeBagBrand: string;
      relativeBagPath: string;
      id: string;
      unsubscribed?: boolean;
      verified?: boolean;
    }

    try {
      const registrationsObj = await (
        await fetch("getRegistrations", {
          body: JSON.stringify({
            token: accessToken
          }),
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        })
      ).json();

      console.log(registrationsObj);

      const rr: RegistrationData[] = registrationsObj.map((r: R) => {
        return {
          choosenBagImage: r.relativeBagPath,
          choosenBagName: r.relativeBagBrand,
          date: r.date.toString(),
          email: r.email,
          location: `${r.location.country} ${r.location.town}`,
          unsubscribed: r.unsubscribed,
          verified: r.verified
        } as RegistrationData;
      });

      console.log(rr);

      setRegistrationsData(rr);

      if (!allowed) setAllowed(true);
    } catch (e) {
      Cookies.remove("password", { secure: true });

      setTimeout(() => fetchRegistations(), 1000);
    }
  }, []);

  const fetchDaysData = useCallback(async () => {
    const data = await (await fetch("auth")).json();

    const cachedPassword = Cookies.get("password");
    const password = cachedPassword || prompt("Enter password");

    if (!cachedPassword)
      Cookies.set("password", password || "", { secure: true });

    // const password = "mytestpassword";
    const { token } = data;
    const accessToken = sha256(token + password);

    try {
      const daysObj: any[] = await (
        await fetch("getDaysData", {
          body: JSON.stringify({
            token: accessToken
          }),
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        })
      ).json();

      const dd: DayData[] = daysObj.map(
        ({ subscriptions, registrations, visits, time, id }) => ({
          id,
          registrations,
          subscriptions,
          time: new Date(time),
          visits
        })
      );

      setDaysData(dd);
      if (!allowed) setAllowed(true);
    } catch (e) {
      Cookies.remove("password", { secure: true });

      setTimeout(() => fetchRegistations(), 1000);
    }
  }, []);

  const onExportButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const registrationsStr = registrationsData
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

  const onLogOutButtonClick = () => {
    Cookies.remove("password");

    window.location.reload();
  };

  useEffect(() => {
    fetchRegistations();
    fetchDaysData();
  }, [fetchRegistations]);

  // const minR = 30;
  // const minS = 5;
  // const minV = 100;
  // const noize = 5;
  // const growPerDay = 0.5;
  // const sinCoeff1 = 10;
  // const sinCoeff2 = 6;

  // function f(min: number, i: number): number {
  //   return Math.floor(
  //     min +
  //       (Math.random() - 0.5) * noize +
  //       growPerDay * i +
  //       sinCoeff2 * Math.sin(i / sinCoeff1)
  //   );
  // }

  // const daysData: Array<{
  //   time: Date;
  //   registrations: number;
  //   visits: number;
  //   subscriptions: number;
  // }> = new Array(130).fill(null).map((_, i, arr) => ({
  //   registrations: f(minR, i),
  //   subscriptions: f(minS, i),
  //   time: addDays(Date.now(), i - arr.length),
  //   visits: f(minV, i)
  // }));

  return (
    <div
      style={{ padding: "1em", visibility: allowed ? "visible" : "hidden" }}
      className="registrationsPage"
    >
      <div className="header">
        <Button onClick={onExportButtonClick} className="sendButton">
          Export
        </Button>
        <Button onClick={onLogOutButtonClick} className="logoutButton">
          Log Out
        </Button>
      </div>
      {daysData.length ? <Plot data={daysData} /> : null}
      <div style={{ marginTop: "1em" }}>
        <Table registrations={registrationsData} />
      </div>
    </div>
  );
};

export default RegistrationsPage;
