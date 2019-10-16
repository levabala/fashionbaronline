import './SubscriptionBlock.scss';

import classNames from 'classnames';
import { sha256 } from 'js-sha256';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import SubscriptionDone from '../SubscriptionDone';
import TextInput from '../TextInput';
import { key as IPGeolocationApiKey } from './apikey.private.json';

const EMAIL_POST_PATH = `${
  window.location.href.includes("localhost")
    ? "http://localhost:3000/"
    : window.location.href
}subscribe`;

const SubscriptionBlock = () => {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);
  const [sendTry, setSendTry] = useState(false);

  let emptyInputReport = false;

  const onSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElem = event.currentTarget.querySelector(
      ".email"
    ) as HTMLInputElement | null;
    if (!inputElem) return;

    if (inputElem.value === "") {
      inputElem.setCustomValidity("Input is empty");
      inputElem.reportValidity();

      emptyInputReport = true;
    } else emptyInputReport = false;

    if (inputElem.validity.valid) sendEmail(inputElem.value);

    // else console.warn("input is invalid!");
  };

  const sendEmail = async (emailAddress: string) => {
    const locationData = await (await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGeolocationApiKey}`
    )).json();
    const { continent_name: country, city, time_zone, ip } = locationData;

    const { choosenBag } = window as any;

    const sendingData = {
      choosenBag,
      date: time_zone.current_time,
      email: emailAddress,
      id: sha256(ip),
      location: {
        city,
        country
      }
    };
    console.log(sendingData);

    fetch(EMAIL_POST_PATH, {
      body: JSON.stringify(sendingData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      mode: "no-cors"
    }).then(() => {
      (window as any).emailSent = true;
    });

    setEmailSent(true);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    // event.currentTarget.reportValidity();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") event.currentTarget.checkValidity();

    if (emptyInputReport) {
      event.currentTarget.setCustomValidity("");
      event.currentTarget.reportValidity();
      emptyInputReport = false;
    }
  };

  const closeSubscriptionDone = () => {
    setEmailSent(false);
  };

  const sendButtonClick = () => {
    setSendTry(true);
  };

  const onInputFocus = () => {
    console.log("focused");

    const callback = () => {
      document.body.classList.add("keyboardVisible");
      document
        .querySelectorAll(".viewBlock")
        .forEach(block => block.setAttribute("style", "height: 100%"));

      const postCallback = () => {
        document.body.classList.remove("keyboardVisible");
        window.removeEventListener("resize", postCallback);
      };

      window.removeEventListener("resize", callback);
      window.addEventListener("resize", postCallback);
    };
    window.addEventListener("resize", callback);
  };

  return (
    <form className="subscriptionBlock" onSubmit={onSend} action="#">
      <TextInput
        placeholder="example@fashionbar.online"
        key="input"
        className={classNames(
          "email",
          (window as any).emailSent ? "done" : "",
          sendTry ? "sendTried" : ""
        )}
        type="email"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onClick={onInputFocus}
        // onFocus={onFocus}
        // ref={inputBoxRef}
        // id={v4()}
        // required
      />
      <Button className="send" key="button" onClick={sendButtonClick}>
        <b>{t("subscriptionSmall.subscribe")}</b>
        {t("subscriptionSmall.postSubscribe")}
      </Button>
      <SubscriptionDone
        visible={emailSent}
        closeCallback={closeSubscriptionDone}
      />
    </form>
  );
};

export default SubscriptionBlock;
