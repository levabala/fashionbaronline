import './SubscriptionBlock.scss';

import classNames from 'classnames';
import { sha256 } from 'js-sha256';
import detect from 'mobile-detect';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import SubscriptionDone from '../SubscriptionDone';
import TextInput from '../TextInput';
import { key as IPGeolocationApiKey } from './apikey.private.json';

const os = new detect(window.navigator.userAgent).os();
const EMAIL_POST_PATH = `${
  window.location.href.includes("localhost")
    ? "http://localhost:3000/"
    : window.location.href
}subscribe`;

let counter = 0;

const SubscriptionBlock = () => {
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);
  const [sendTry, setSendTry] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [startOffset, setStartOffset] = useState(0);
  const [emptyInputReport, setEmptyInputReport] = useState(false);

  const index = useMemo(() => counter++, []);

  const onSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const inputElem = event.currentTarget.querySelector(
      ".email"
    ) as HTMLInputElement | null;
    if (!inputElem) return;

    if (inputElem.value === "") {
      inputElem.setCustomValidity("Input is empty");
      inputElem.reportValidity();

      setEmptyInputReport(true);
    } else setEmptyInputReport(false);

    if (inputElem.validity.valid) sendEmail(inputElem.value);

    // else console.warn("input is invalid!");
  };

  const sendEmail = async (emailAddress: string) => {
    document.body.classList.add("subscriptionDoneVisible");

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
    console.log("blur");
    // setTimeout(() => {
    setTimeout(() => {
      document.body.classList.remove("keyboardVisible");
      document.body.classList.remove("caseZero");
    });

    setTimeout(() => {
      if (os === "iOS" || os === "iPadOS")
        document.body.scrollBy({
          left: 0,
          top: 1
        });
    }, 1000);
    // });

    // document.body.scrollTo({
    //   left: 0,
    //   top: startOffset + 1
    // });

    // alert(startOffset + 1);
    // alert(
    //   `${window.scrollY} ${document.body.scrollTop} ${document.documentElement.scrollTop}`
    // );
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") event.currentTarget.checkValidity();

    if (emptyInputReport) {
      event.currentTarget.setCustomValidity("");
      event.currentTarget.reportValidity();
      setEmptyInputReport(false);
    }
  };

  const closeSubscriptionDone = () => {
    setEmailSent(false);
    document.body.classList.remove("subscriptionDoneVisible");
  };

  const sendButtonClick = () => {
    // alert("send");
    setSendTry(true);
  };

  const onInputFocus = () => {
    const initialHeight = window.innerHeight;
    const viewBlockHeight = (document.querySelector(
      ".viewBlock"
    ) as HTMLDivElement).offsetHeight;
    const topBarHeight = initialHeight - viewBlockHeight;
    console.log({ topBarHeight });

    console.log("keyboardVisible");
    document.body.classList.add("keyboardVisible");
    if (index === 0) document.body.classList.add("caseZero");
    // alert(index);

    if (os === "iOS" || os === "iPadOS") {
      // document.body.classList.add("keyboardVisible");
      if (!formRef.current) return;

      // setStartOffset(document.body.scrollTop);
      if (index === 1)
        formRef.current.scrollIntoView({ behavior: "auto", block: "center" });
      return;
    }

    // const callback = () => {
    //   const withKeyboardHeight = window.innerHeight;
    //   if (Math.abs(initialHeight - withKeyboardHeight) < 100) return;

    //   // document.body.classList.add("keyboardVisible");
    //   // document
    //   //   .querySelectorAll(".viewBlock")
    //   //   .forEach(block => block.setAttribute("style", "height: 100%"));

    //   const keyboardHeight = initialHeight - window.innerHeight;
    //   console.log({ keyboardHeight });

    //   // const d = document.querySelector(".centralContainer") as HTMLDivElement;
    //   // d.setAttribute(
    //   //   "style",
    //   //   `transform: translateY(-${keyboardHeight + 40}px)`
    //   // );

    //   (window as any).resizeRestricted = true;

    //   const postCallback = () => {
    //     const withoutKeyboardHeight = window.innerHeight;
    //     if (Math.abs(withoutKeyboardHeight - withKeyboardHeight) < 100) return;

    //     console.log("keyboardHidden");
    //     document.body.classList.remove("keyboardVisible");

    //     window.removeEventListener("resize", postCallback);

    //     (window as any).resizeRestricted = false;

    //     // d.setAttribute("style", ``);
    //   };

    //   window.removeEventListener("resize", callback);
    //   window.addEventListener("resize", postCallback);
    // };
    // window.addEventListener("resize", callback);
  };

  return (
    <form
      className="subscriptionBlock"
      onSubmit={onSend}
      action="#"
      ref={formRef}
    >
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
        onFocus={onInputFocus}
        // onFocus={onFocus}
        // ref={inputBoxRef}
        // id={v4()}
        // required
      />
      <Button
        className="send"
        key="button"
        onClick={sendButtonClick}
        onClickCapture={sendButtonClick}
        onTouchMoveCapture={sendButtonClick}
        onTouchStartCapture={sendButtonClick}
        onTouchEndCapture={sendButtonClick}
        // onTouchStartCapture={sendButtonClick}
      >
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
