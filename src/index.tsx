import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const updateVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

// window.addEventListener("resize", updateVH);
updateVH();

const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
if (isAndroid)
  document.write(
    '<meta name="viewport" content="width=device-width,height=' +
      window.innerHeight +
      ', initial-scale=1.0">'
  );

ReactDOM.render(<App />, document.getElementById("root"));

// serviceWorker.register();
