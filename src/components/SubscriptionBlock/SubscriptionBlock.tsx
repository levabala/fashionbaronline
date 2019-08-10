import './SubscriptionBlock.scss';

import classNames from 'classnames';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import SubscriptionDone from '../SubscriptionDone';
import TextInput from '../TextInput';

const EMAIL_POST_PATH = "http://localhost:8125/subscribe";

const SubscriptionBlock = () => {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);

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
    const locationData = await (await fetch("http://ip-api.com/json")).json();
    const { country, city } = locationData;

    const sendingData = {
      date: new Date().toDateString(),
      email: emailAddress,
      location: { country, city }
    };
    // console.log(sendingData);

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

  return (
    <form className="subscriptionBlock" onSubmit={onSend} action="#">
      <TextInput
        placeholder="example@fashionbar.online"
        key="input"
        className={classNames("email", (window as any).emailSent ? "done" : "")}
        type="email"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        // onFocus={onFocus}
        // ref={inputBoxRef}
        // id={v4()}
        // required
      />
      <Button className="send" key="button">
        {t("subscriptionSmall.save")}
      </Button>
      <SubscriptionDone
        visible={emailSent}
        closeCallback={closeSubscriptionDone}
      />
    </form>
  );
};

export default SubscriptionBlock;
