import './index.scss';

import Cookies from 'js-cookie';
import detect from 'mobile-detect';
import React from 'react';
import ReactDOM from 'react-dom';
import { polyfill } from 'smoothscroll-polyfill';

import App from './App';
import StyleVariables from './variables.scss';

const os = new detect(window.navigator.userAgent).os();
const ios = os === "iOS" || os === "iPadOS";

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

polyfill();

if (window.location.href.includes("verifyEmail"))
  (window as any).emailConfirmedBoxVisible = true;

// const updateVH = () => {
//   if ((window as any).resizeRestricted) return;
//   const vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty("--vh", `${vh}px`);

//   console.log("updated vh");

//   // window.removeEventListener("resize", updateVH);
// };

// updateVH();
// function updateVH() {
//   document.body.style.height = `${window.innerHeight}px`;
//   console.log(document.body.getAttribute("style"));
// }
// window.addEventListener("resize", updateVH);

// alert(window.innerWidth);
// const inter = setInterval(() => console.log(window.innerWidth));
// setTimeout(() => clearInterval(inter), 2000);

document.body.classList.add("hidden");
if (window.innerWidth < mobileVersionMaxWidth) {
  const interval = setInterval(() => {
    document.body.style.height = `${window.innerHeight}px`;
    // document.body.style.width = `${window.innerWidth}px`;
    document.documentElement.style.height = `${window.innerHeight +
      (ios ? 0 : 1)}px`;
    document.documentElement.style.width = `${window.innerWidth}px`;
    console.log("window size approving");
  });
  setTimeout(() => clearInterval(interval), 500);
}

// alert(`${window.innerWidth} ${window.innerHeight}`);

// if (window.innerWidth < mobileVersionMaxWidth) {
//   (document.body.querySelector(
//     ".centralContainer"
//   ) as HTMLDivElement).style.height = `${window.innerHeight}px`;
//   // document.body.style.width = `${window.innerWidth}px`;
//   document.documentElement.style.height = `${window.innerHeight +
//     (ios ? 1 : 0)}px`;
//   document.documentElement.style.width = `${window.innerWidth}px`;

//   setTimeout(() => {
//     (document.body.querySelector(
//       ".centralContainer"
//     ) as HTMLDivElement).style.height = `${window.innerHeight}px`;
//     document.body.classList.add("hidden");
//     document.documentElement.style.height = `${window.innerHeight +
//       (ios ? 1 : 0)}px`;
//   });
// }

setTimeout(() => document.body.classList.remove("hidden"), 800);

// const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
// if (isAndroid)
//   document.write(
//     '<meta name="viewport" content="width=device-width,height=' +
//       window.innerHeight +
//       ', initial-scale=1.0">'
//   );

ReactDOM.render(<App />, document.body);
// ReactDOM.render(<SnapTest />, document.body);
// ReactDOM.render(<SnapTest />, document.getElementById("root"));

// register ();

const visited = Cookies.get("alreadyVisited");
if (!visited) {
  Cookies.set("alreadyVisited", "true");

  fetch("registerUniqualUser");
}
