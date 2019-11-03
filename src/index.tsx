import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

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

document.body.style.height = `${window.innerHeight}px`;
document.documentElement.style.height = `${window.innerHeight + 1}px`;

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
