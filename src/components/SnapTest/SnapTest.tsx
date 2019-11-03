import './SnapTest.scss';

import React from 'react';
import Div100vh from 'react-div-100vh';

const SnapTest = () => {
  return (
    <Div100vh className="container">
      {new Array(10).fill(null).map((_, i) => (
        <div className="element" key={i}>
          <p>{i}</p>

          <img
            src="https://thumbs.dreamstime.com/z/tv-test-image-card-rainbow-multi-color-bars-geometric-signals-retro-hardware-s-minimal-pop-art-print-suitable-89603635.jpg"
            width="300"
            height="200"
          />
        </div>
      ))}
    </Div100vh>
  );
};

export default SnapTest;
