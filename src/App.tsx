import './App.scss';
import './i18n';

import { disableBodyScroll } from 'body-scroll-lock';
import React, { Suspense, useRef } from 'react';

import CentralContainer from './components/CentralContainer';
import ContentBlock from './components/ContentBlock';
import Description from './components/Description';
import FashionGrid from './components/FashionGrid';
import Features from './components/Features';
import Footer from './components/Footer';
import Header from './components/Header';
import MainFeature from './components/MainFeature';
import SubscriptionBig from './components/SubscriptionBig';
import SubscriptionSmall from './components/SubscriptionSmall';
import Title from './components/Title';
import ViewBlock from './components/ViewBlock';

const App: React.FC = () => {
  const centralContainerRef = useRef<HTMLDivElement>(null);

  const triggerScrollValue = 300;
  const afterScrollBlindTime = 300;
  let blindTime = false;
  let scrollAccumulator = 0;

  const scrollCheck = () => {
    console.log(scrollAccumulator);
    if (Math.abs(scrollAccumulator) > triggerScrollValue && !isScrolling) {
      scrollPage((Math.sign(scrollAccumulator) || 1) as 1 | -1);
      scrollAccumulator = 0;
    }
  };

  let scrollTimeout: NodeJS.Timeout;
  const waitForScrollEnd = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      scrollCheck();
      scrollAccumulator = 0;
      console.log(isScrolling);
    }, 60);
  };

  let currentBlockIndex = 0;
  let isScrolling = false;
  const scrollPage = (delta: 1 | -1) => {
    const centralContainer = centralContainerRef.current;
    if (!centralContainer) return;

    currentBlockIndex = Math.min(
      Math.max(currentBlockIndex + delta, 0),
      centralContainer.children.length - 1
    );
    const block = centralContainer.children[currentBlockIndex];
    block.scrollIntoView({ behavior: "smooth", block: "center" });
    isScrolling = true;
    waitForScrollEnd();

    blindTime = true;
    setTimeout(() => (blindTime = false), afterScrollBlindTime);

    // console.log(currentBlockIndex, block);
    console.log("scroll to", currentBlockIndex);
  };

  const onFashionGridRendered = () => {
    if (!centralContainerRef.current) return;

    const centralContainer = centralContainerRef.current;

    currentBlockIndex = Math.round(window.scrollY / window.innerHeight);
    console.log(
      "start from",
      currentBlockIndex,
      window.scrollY / window.innerHeight
    );

    const viewBlocks = Array.from(
      centralContainer.querySelectorAll(".viewBlock")
    );
    let previous: Element;
    const intersectionObserver = new IntersectionObserver(
      ([intersection]) => {
        previous = intersection.isIntersecting ? intersection.target : previous;
        if (!intersection.isIntersecting && previous)
          previous.classList.add("activated");
      },
      {
        root: centralContainerRef.current,
        threshold: 0.3
      }
    );

    viewBlocks.forEach(block => intersectionObserver.observe(block));

    // let lastScrollY = window.scrollY;
    document.body.addEventListener("wheel", e => {
      if (blindTime) return;

      scrollAccumulator += e.deltaY;

      scrollCheck();

      // console.log(scrollAccumulator);
    });

    disableBodyScroll(document.body);
  };

  window.addEventListener("scroll", waitForScrollEnd);

  return (
    <div className="App  parallax">
      <Suspense fallback={null}>
        <CentralContainer ref={centralContainerRef}>
          <ViewBlock first>
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

          <FashionGrid renderCallback={onFashionGridRendered} />

          <ViewBlock forced around>
            <SubscriptionBig />
          </ViewBlock>

          <ViewBlock forced around>
            <Footer />
          </ViewBlock>
        </CentralContainer>
      </Suspense>
    </div>
  );
};

export default App;
