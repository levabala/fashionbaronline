import './SubscriptionBlock.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const EMAIL_POST_PATH = "http://localhost:8125/subscribe";

const SubscriptionBlock = () => {
  const { t } = useTranslation();
  // const inputBoxRef = useRef<HTMLInputElement>(null);

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
    });
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

  // const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
  //   // const inputElement = inputBoxRef.current as HTMLInputElement;
  //   // const blurer = (me: MouseEvent) => {
  //   //   const clickedElement = me.target as Element;
  //   //   console.log(
  //   //     inputElement.id,
  //   //     clickedElement.id,
  //   //     clickedElement.id === inputElement.id
  //   //   );
  //   //   if (clickedElement.id !== inputElement.id) {
  //   //     inputElement.blur();
  //   //     document.removeEventListener("click", blurer);
  //   //   }
  //   // };
  //   // document.addEventListener("click", blurer);
  // };

  return (
    <form className="subscriptionBlock" onSubmit={onSend} action="#">
      <TextInput
        placeholder="example@fashionbar.online"
        key="input"
        className="email"
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
    </form>
  );
};

export default SubscriptionBlock;
