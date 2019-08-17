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
import StyleVariables from './variables.scss';

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);

const App: React.FC = () => {
  const centralContainerRef = useRef<HTMLDivElement>(null);

  const triggerScrollValue = 200;
  const afterScrollBlindTime = 300;
  let blindTime = false;
  let scrollAccumulator = 0;

  const scrollCheck = () => {
    // console.log(scrollAccumulator);
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

      // const centralContainer = centralContainerRef.current;
      // if (!centralContainer) return;
      // const block = centralContainer.children[currentBlockIndex];

      // block.classList.add("activated");
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
    // console.log(
    //   "start from",
    //   currentBlockIndex,
    //   window.scrollY / window.innerHeight
    // );

    const viewBlocks = Array.from(
      centralContainer.querySelectorAll(".viewBlock")
    );
    let previous: Element;
    const intersectionObserver = new IntersectionObserver(
      ([intersection]) => {
        previous = intersection.isIntersecting ? intersection.target : previous;
        // console.log(previous);

        if (!intersection.isIntersecting && previous)
          previous.classList.add("activated");
      },
      {
        root: centralContainer,
        threshold: 0.3
      }
    );

    viewBlocks.forEach(block => intersectionObserver.observe(block));
    // console.log(viewBlocks);

    // let lastScrollY = window.scrollY;
    const scrollHandler = (deltaY: number) => {
      if (blindTime) return;
      console.log(deltaY);

      scrollAccumulator += deltaY;

      scrollCheck();

      // console.log(scrollAccumulator);
    };

    // let lastTouchPosition = 0;
    document.body.addEventListener("wheel", ({ deltaY }) =>
      scrollHandler(deltaY)
    );
    // document.body.addEventListener("touchmove", ({ touches }) => {
    //   scrollHandler(lastTouchPosition - touches[0].clientY);
    //   lastTouchPosition = touches[0].clientY;
    // });
    // document.body.addEventListener(
    //   "touchstart",
    //   ({ touches }) => (lastTouchPosition = touches[0].clientY)
    // );


    if (window.innerWidth > mobileVersionMaxWidth)
    disableBodyScroll(document.body);
    // disableBodyScroll(centralContainer);
  };

  window.addEventListener("scroll", waitForScrollEnd);

  return (
    <div className="App">
      <Suspense fallback={null}>
        <CentralContainer ref={centralContainerRef}>
          <ViewBlock
            first
            fitContent={window.innerWidth > mobileVersionMaxWidth}
          >
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
