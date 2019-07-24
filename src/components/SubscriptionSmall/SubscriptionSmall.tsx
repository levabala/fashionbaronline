import './SubscriptionSmall.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../Button';
import TextInput from '../TextInput';

const SubscriptionSmall = () => {
  const { t } = useTranslation();

  let emptyInputReport = false;

  const onSend = (event: React.FormEvent<HTMLFormElement>) => {
    const inputElem = event.currentTarget.querySelector(
      ".email"
    ) as HTMLInputElement | null;
    if (!inputElem) return;

    if (inputElem.value === "") {
      inputElem.setCustomValidity("Input is empty");
      inputElem.reportValidity();

      emptyInputReport = true;
    } else emptyInputReport = false;
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
    <form className="subscriptionSmall" onSubmit={onSend} action="#">
      <div className="label">{t("subscriptionSmall.label")}</div>
      <TextInput
        placeholder="example@fashionbar.online"
        className="email"
        type="email"
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        // required
      />
      <Button className="send" type="submit">
        {t("subscriptionSmall.save")}
      </Button>
    </form>
  );
};

export default SubscriptionSmall;
