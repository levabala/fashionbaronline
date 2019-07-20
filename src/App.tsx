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
    <div className="App">
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
  );
};

export default App;
