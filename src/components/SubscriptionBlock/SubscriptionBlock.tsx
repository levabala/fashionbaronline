import './SubscriptionBlock.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const EMAIL_POST_PATH = "http://localhost:3000/subscribe";

const SubscriptionBlock = () => {
  const { t } = useTranslation();

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

    sendEmail("example@ya.ru");
  };

  const sendEmail = (emailAddress: string) => {
    fetch(EMAIL_POST_PATH, {
      body: JSON.stringify({
        email: emailAddress
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    });
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.currentTarget.reportValidity();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event.key);
    if (event.key === "Escape") event.currentTarget.checkValidity();

    if (emptyInputReport) {
      event.currentTarget.setCustomValidity("");
      event.currentTarget.reportValidity();
      emptyInputReport = false;
    }
  };

  return (
    <form className="subscriptionBlock" onSubmit={onSend} action="#">
      <TextInput
        placeholder="example@fashionbar.online"
        key="input"
        className="email"
        type="email"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        // required
      />
      <Button className="send" key="button">
        {t("subscriptionSmall.save")}
      </Button>
    </form>
  );
};

export default SubscriptionBlock;
