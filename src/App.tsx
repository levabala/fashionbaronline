import './App.scss';
import './i18n';

import React, { Suspense } from 'react';

import Description from './components/Description';
import FashionGrid from './components/FashionGrid';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import HorizontalLimiter from './components/HorizontalLimiter';
import MainFeature from './components/MainFeature';
import SubscriptionBig from './components/SubscriptionBig';
import SubscriptionSmall from './components/SubscriptionSmall';
import Title from './components/Title';

const App: React.FC = () => {
  return (
    <div className="App  parallax">
      <div className="mainContainer">
        <div className="parallaxLayerBack">
          <img
            src={"/assets/images/rectRightRedBlur.png"}
            alt="hz"
            style={{ position: "absolute", top: "900px", left: 0 }}
          />
          <img
            src={"/assets/images/rectRightPurpleBlur.png"}
            alt="hz"
            style={{ position: "absolute", top: "1900px", left: 0 }}
          />
        </div>
        <div className="parallaxLayerBase">
          <Suspense fallback={null}>
            <HorizontalLimiter>
              <Header />

              <Title />
              <SubscriptionSmall />
              <Features />

              <Description />
              <MainFeature />
              <FashionGrid />
              <SubscriptionBig />
              <Footer />
            </HorizontalLimiter>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
