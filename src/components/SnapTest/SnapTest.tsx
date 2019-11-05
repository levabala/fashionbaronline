import './SnapTest.scss';

import React from 'react';

const SnapTest = () => {
  return (
    <>
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
    </>
  );
};

export default SnapTest;
