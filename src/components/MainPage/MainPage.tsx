import { disableBodyScroll } from 'body-scroll-lock';
import React, { Suspense, useRef } from 'react';

import StyleVariables from '../../variables.scss';
import CentralContainer from '../CentralContainer';
import ContentBlock from '../ContentBlock';
import Description from '../Description';
import FashionGrid from '../FashionGrid';
import Features from '../Features';
import Footer from '../Footer';
import Header from '../Header';
import MainFeature from '../MainFeature';
import SubscriptionBig from '../SubscriptionBig';
import SubscriptionSmall from '../SubscriptionSmall';
import Title from '../Title';
import ViewBlock from '../ViewBlock';

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fadeAnimationDuration = parseFloat(StyleVariables.fadeAnimationDuration);

// tslint:disable
function toggleFullScreen() {
  if (window.innerWidth <= mobileVersionMaxWidth) window.scrollTo(0, 1);
}
// tslint:enable

const MainPage: React.FC = () => {
  const centralContainerRef = useRef<HTMLDivElement>(null);

  const triggerScrollValue =
    window.innerWidth > mobileVersionMaxWidth ? 150 : 50;
  const afterScrollBlindTime =
    window.innerWidth > mobileVersionMaxWidth ? 600 : 300;
  let blindTime = false;
  let scrollAccumulator = 0;

  const scrollCheck = () => {
    // console.log(scrollAccumulator);
    if (Math.abs(scrollAccumulator) > triggerScrollValue) {
      scrollPage((Math.sign(scrollAccumulator) || 1) as 1 | -1);
      scrollAccumulator = 0;
    }
  };

  let currentBlockIndex = 0;
  const scrollPage = (delta: 1 | -1) => {
    const centralContainer = centralContainerRef.current;
    if (!centralContainer) return;

    const previousBlock = centralContainer.children[currentBlockIndex];
    const previousIndex = currentBlockIndex;
    currentBlockIndex = Math.min(
      Math.max(currentBlockIndex + delta, 0),
      centralContainer.children.length - 1
    );

    if (currentBlockIndex === previousIndex) return;

    const block = centralContainer.children[currentBlockIndex];

    previousBlock.classList.remove("activated");
    previousBlock.classList.remove("reactivated");

    setTimeout(() => {
      if (delta === -1) block.classList.add("reactivated");
      else block.classList.add("activated");

      block.classList.remove("disactivated");
      previousBlock.classList.add("disactivated");
    }, fadeAnimationDuration * 1000);

    blindTime = true;
    setTimeout(() => (blindTime = false), afterScrollBlindTime);

    // console.log(currentBlockIndex, block);
    console.log("scroll to", currentBlockIndex);
  };

  (window as any).scrollPage = scrollPage;

  const onFashionGridRendered = () => {
    toggleFullScreen();
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
    viewBlocks[currentBlockIndex].classList.add("activated");

    let previous: Element;
    const intersectionObserver = new IntersectionObserver(
      ([intersection]) => {
        // const preprevious = previous;
        previous = intersection.isIntersecting ? intersection.target : previous;
        // console.log(preprevious, previous);

        // console.log(previous !== preprevious);
        // if (previous !== preprevious && preprevious)
        //   preprevious.classList.add("disactivated");

        // if (!intersection.isIntersecting && previous) {
        //   previous.classList.add("activated");
        //   previous.classList.remove("disactivated");
        // }

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
      toggleFullScreen();
      if (blindTime) return;

      scrollAccumulator += deltaY;
      console.log(scrollAccumulator);

      scrollCheck();
    };

    let lastTouchPosition = 0;
    document.body.addEventListener("wheel", ({ deltaY }) =>
      scrollHandler(deltaY)
    );
    document.body.addEventListener("touchmove", ({ touches }) => {
      scrollHandler(lastTouchPosition - touches[0].clientY);
      lastTouchPosition = touches[0].clientY;
    });
    document.body.addEventListener(
      "touchstart",
      ({ touches }) => (lastTouchPosition = touches[0].clientY)
    );
    window.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowDown":
          scrollPage(1);
          break;
        case "ArrowUp":
          scrollPage(-1);
          break;
      }
    });

    disableBodyScroll(document.body);
    // if (window.innerWidth <= mobileVersionMaxWidth)
    //   disableBodyScroll(centralContainer);
  };

  return (
    <Suspense fallback={null}>
      <CentralContainer ref={centralContainerRef}>
        <ViewBlock first around={window.innerWidth > mobileVersionMaxWidth}>
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
  );
};

export default MainPage;
