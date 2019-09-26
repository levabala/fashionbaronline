import { disableBodyScroll } from 'body-scroll-lock';
import React, { lazy, Suspense, useEffect, useRef } from 'react';

import TagEnum from '../../types/TagEnum';
import StyleVariables from '../../variables.scss';
import CentralContainer from '../CentralContainer';
import ContentBlock from '../ContentBlock';
import Description from '../Description';
import Header from '../Header';
import Title from '../Title';
import ViewBlock from '../ViewBlock';

// import Features from '../Features';
// import Footer from '../Footer';
// import MainFeature from '../MainFeature';
// import SubscriptionBig from '../SubscriptionBig';
// import SubscriptionSmall from '../SubscriptionSmall';
// import FashionGrid from "../FashionGrid";
// const Header = lazy(() => import("../Header"));
const FashionGrid = lazy(() => import("../FashionGrid"));
const Features = lazy(() => import("../Features"));
const MainFeature = lazy(() => import("../MainFeature"));
const SubscriptionBig = lazy(() => import("../SubscriptionBig"));
const SubscriptionSmall = lazy(() => import("../SubscriptionSmall"));
const Footer = lazy(() => import("../Footer"));

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fadeAnimationDuration = parseFloat(StyleVariables.fadeAnimationDuration);
const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);

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
    block.classList.remove("activated");
    block.classList.remove("reactivated");

    setTimeout(() => {
      if (delta === -1) block.classList.add("reactivated");
      else block.classList.add("activated");

      block.classList.remove("disactivated");
      previousBlock.classList.add("disactivated");
    }, fadeAnimationDuration * 1000);

    blindTime = true;
    setTimeout(() => (blindTime = false), afterScrollBlindTime);

    // console.log(currentBlockIndex, block);
    // console.log("scroll to", currentBlockIndex);
  };

  const scrollTo = (id: string) => {
    const centralContainer = centralContainerRef.current;
    if (!centralContainer) return;

    const targetBlockIndex = Array.from(centralContainer.children).findIndex(
      el => el.id === id
    );
    if (targetBlockIndex === -1) return;

    let delta = targetBlockIndex - currentBlockIndex;
    while (delta !== 0) {
      scrollPage(delta >= 1 ? 1 : -1);
      delta -= Math.sign(delta);
    }
  };

  (window as any).scrollPage = scrollPage;
  (window as any).scrollTo = scrollTo;

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
      // console.log(scrollAccumulator);

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

  // useEffect(() => {
  //   setTimeout(() => scrollTo(TagEnum.Collection), 500);
  // }, []);

  return (
    <Suspense fallback={null}>
      <CentralContainer ref={centralContainerRef}>
        <ViewBlock
          first
          around={window.innerWidth > wideDisplayMinWidth}
          noSuspense
        >
          <ContentBlock>
            <Header />
            <Title />
          </ContentBlock>
          <ContentBlock>
            <SubscriptionSmall />
          </ContentBlock>
        </ViewBlock>

        <ViewBlock forced around id={TagEnum.HowItWorks}>
          <Features />
        </ViewBlock>

        <ViewBlock forced around id={TagEnum.About}>
          <Description />
        </ViewBlock>

        {/* <ViewBlock forced around id={TagEnum.MainFeature}>
          <MainFeature />
        </ViewBlock> */}

        <FashionGrid
          renderCallback={onFashionGridRendered}
          id={TagEnum.Collection}
        />

        <ViewBlock forced around id={TagEnum.Subscribe}>
          <SubscriptionBig />
        </ViewBlock>

        <ViewBlock forced around id={"contacts"}>
          <Footer />
        </ViewBlock>
      </CentralContainer>
    </Suspense>
  );
};

export default MainPage;
