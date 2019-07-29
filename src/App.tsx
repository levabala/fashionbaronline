import './App.scss';
import './i18n';

import React, { Suspense } from 'react';

import ContentBlock from './components/ContentBlock';
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
import ViewBlock from './components/ViewBlock';

const App: React.FC = () => {
  return (
    <div className="App  parallax">
      <div className="mainContainer">
        <div className="parallaxLayerBack">
          <img
            src={"/assets/images/rectRightRedBlur.png"}
            alt="hz"
            className="parallaxImage1"
          />
          <img
            src={"/assets/images/rectRightPurpleBlur.png"}
            alt="hz"
            className="parallaxImage2"
          />
        </div>
        <div className="parallaxLayerBase">
          <Suspense fallback={null}>
            <HorizontalLimiter>
              <ViewBlock>
                <ContentBlock>
                  <Header />
                  <Title />
                </ContentBlock>
                <ContentBlock>
                  <SubscriptionSmall />
                </ContentBlock>
              </ViewBlock>

              <ViewBlock forced around>
                <Features />
              </ViewBlock>

              <ViewBlock forced around>
                <Description />
              </ViewBlock>

              <ViewBlock forced around>
                <MainFeature />
              </ViewBlock>

              <FashionGrid />

              <ViewBlock forced around>
                <SubscriptionBig />
              </ViewBlock>

              <ViewBlock forced around>
                <Footer />
              </ViewBlock>
            </HorizontalLimiter>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
