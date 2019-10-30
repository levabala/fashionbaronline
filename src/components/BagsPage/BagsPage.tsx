import './BagsPage.scss';

import Cookies from 'js-cookie';
import { sha256 } from 'js-sha256';
import React, { useCallback, useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { useDebounce } from 'use-hooks';

import BagAdd from './BagAdd';
import BagElement from './BagElement';
import SavingWidget from './SavingWidget';

export interface BagData {
  id: string;
  brandName: string;
  nameOfModel: string;
  price: number;
}

function useBags() {
  const { setSaving } = SavingInfo.useContainer();
  const [firstLoad, setFirstLoad] = useState(true);
  const [bags, setBags] = useState<BagData[]>([
    {
      brandName: "test brand name",
      id: "test id 1",
      nameOfModel: "test name of model",
      price: 123
    },
    {
      brandName: "test brand name",
      id: "test id 2",
      nameOfModel: "test name of model",
      price: 123
    },
    {
      brandName: "test brand name",
      id: "test id 3",
      nameOfModel: "test name of model",
      price: 123
    },
    {
      brandName: "test brand name",
      id: "test id 4",
      nameOfModel: "test name of model",
      price: 123
    },
    {
      brandName: "test brand name",
      id: "test id 5",
      nameOfModel: "test name of model",
      price: 123
    },
    {
      brandName: "test brand name",
      id: "test id 6",
      nameOfModel: "test name of model",
      price: 123
    }
  ]);

  const bagsDebounced = useDebounce(bags, 3000);

  const setBagRemote = useCallback(async (bag: BagData) => {
    const data = await (await fetch("auth")).json();

    const cachedPassword = Cookies.get("password");
    const password = cachedPassword || prompt("Enter password");

    if (!cachedPassword)
      Cookies.set("password", password || "", {
        secure:
          process.env.NODE_ENV !== "development" &&
          !window.location.href.includes("localhost")
      });

    // const password = "mytestpassword";
    const { token } = data;
    const accessToken = sha256(token + password);

    try {
      const result = await (await fetch("setBag", {
        body: JSON.stringify({
          ...bag,
          token: accessToken
        } as BagData),
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      })).text();

      if (!result) throw new Error("setBag error");

      console.log(result);
    } catch (e) {
      console.log(e);
      Cookies.remove("password");

      setTimeout(() => setBagRemote(bag), 1000);
    }
  }, []);

  const updateBag = (updatedBag: BagData) => {
    const newBags = bags.map(bag =>
      bag.id === updatedBag.id ? updatedBag : bag
    );
    setBags(newBags);
  };

  useEffect(() => {
    if (firstLoad) return;

    setSaving(true);
  }, [bags]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    bags.forEach(bag => setBagRemote(bag));
    setSaving(false);
  }, [bagsDebounced]);

  return { bags, setBags, updateBag };
}

function useSaving() {
  const [saving, setSaving] = useState(false);

  return { saving, setSaving };
}

export const BagsInfo = createContainer(useBags);
export const SavingInfo = createContainer(useSaving);

const BagsPage = () => {
  const { bags, setBags } = BagsInfo.useContainer();

  useEffect(() => {
    const fetcher = async () => {
      const bagsData: BagData[] = await (await fetch("bagsInfo", {
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      })).json();

      console.log(bagsData);

      const allBags: Array<{
        image: string;
        name: string;
      }> = await (await fetch("allBags", {
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      })).json();

      const bagIds = allBags.map(bag =>
        (arr => [arr[arr.length - 2], arr[arr.length - 1]].join("/"))(
          bag.image.split("/")
        )
      );

      console.log(allBags);

      const totalBags: BagData[] = bagIds.map(
        id =>
          ({
            id,
            price: 0,
            nameOfModel: "",
            brandName: "",
            ...bagsData.find(bag => bag.id === id)
          } as BagData)
      );

      setBags(totalBags);

      console.log(totalBags);
    };

    fetcher();
  }, []);

  return (
    <>
      <div className="bagsPage">
        {bags.map(bag => {
          return <BagElement key={bag.id} bag={bag} />;
        })}
        <BagAdd />
      </div>
      <SavingWidget />
    </>
  );
};

export default () => (
  <SavingInfo.Provider>
    <BagsInfo.Provider>
      <BagsPage />
    </BagsInfo.Provider>
  </SavingInfo.Provider>
);
