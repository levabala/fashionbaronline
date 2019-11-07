import detect from 'mobile-detect';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import TagEnum from '../../types/TagEnum';
import StyleVariables from '../../variables.scss';
import CentralContainer from '../CentralContainer';
import ContentBlock from '../ContentBlock';
import Description from '../Description';
import EmailConfirmed from '../EmailConfirmed';
import FashionGrid from '../FashionGrid';
import Features from '../Features';
import Footer from '../Footer';
import Header from '../Header';
import SubscriptionBig from '../SubscriptionBig';
import SubscriptionSmall from '../SubscriptionSmall';
import Title from '../Title';
import ViewBlock from '../ViewBlock';

const mobileVersionMaxWidth = parseFloat(StyleVariables.mobileVersionMaxWidth);
const fadeAnimationDuration = parseFloat(StyleVariables.fadeAnimationDuration);
const wideDisplayMinWidth = parseFloat(StyleVariables.wideDisplayMinWidth);

// document.body.addEventListener("beforeunload", () =>
//   window.scrollTo({ top: 0 })
// );
window.history.scrollRestoration = "manual";
const initialWindowHeight = window.innerHeight;

const os = new detect(window.navigator.userAgent).os();
const ios = os === "iOS" || os === "iPadOS";

if (ios) document.documentElement.classList.add("ios");

const MainPageReforged = React.memo(() => {
  document.documentElement.classList.add("mainContent");

  const triggerScrollValue =
    window.innerWidth > mobileVersionMaxWidth ? 150 : 50;
  const afterScrollBlindTime =
    window.innerWidth > mobileVersionMaxWidth ? 600 : 300;

  // const centralContainerRef = useRef<HTMLDivElement>(null);
  const centralContainerRef = {
    current: document.body
  };

  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blocksCount, setBlocksCount] = useState(0);
  const [accumulator, setAccumulator] = useState(0);
  const [blind, setBlind] = useState(false);

  const listenerWheel = useRef((e: WheelEvent) => {
    /**/
  });

  const scroll = useCallback(
    (delta: number, scrollOnly = false) => {
      if (blind || !blocksCount) return;

      const newBlockIndex = Math.min(
        blocksCount - 1,
        Math.max(currentBlockIndex + delta, 0)
      );

      console.log({ delta, currentBlockIndex, newBlockIndex });

      if (!centralContainerRef.current) return;
      const blocks = centralContainerRef.current.querySelectorAll(".viewBlock");

      if (!blocks.length) return;

      const newBlock = blocks[newBlockIndex] as HTMLDivElement;

      if (os === "iOS" || os === "iPadOS")
        document.body.scrollTo({ top: newBlock.offsetTop });
      else newBlock.scrollIntoView({ behavior: "smooth", block: "start" });
      // console.log(newBlock.offsetTop);

      if (scrollOnly) return;

      if (os !== "iOS" && os !== "iPadOS") {
        Array.from(document.body.querySelectorAll(".viewBlock")).forEach(
          viewBlock => viewBlock.classList.remove("disactivated")
        );

        if (delta === -1) newBlock.classList.add("reactivated");
        else {
          newBlock.classList.add("activated");
          newBlock.children[0].classList.add("activated");
        }

        if (newBlock.querySelector(".fashionGrid"))
          document.documentElement.classList.add("collectionActive");
        else document.documentElement.classList.remove("collectionActive");

        if (currentBlockIndex === newBlockIndex) return;

        const previousBlock = blocks[currentBlockIndex];
        previousBlock.classList.add("disactivated");
        previousBlock.classList.remove("activated");
        previousBlock.classList.remove("reactivated");
      }

      setCurrentBlockIndex(newBlockIndex);
    },
    [currentBlockIndex, blocksCount, blind]
  );

  (window as any).scrolll = scroll;

  const scrollTo = (id: string) => {
    const centralContainer = centralContainerRef.current;
    if (!centralContainer) return;

    const targetBlockIndex = Array.from(centralContainer.children).findIndex(
      el => el.id === id
    );
    if (targetBlockIndex === -1) return;

    scroll(targetBlockIndex - currentBlockIndex);
  };

  //   (window as any).scrollPage = scrollPage;
  (window as any).scrollTo = scrollTo;

  const onLoadCallback = useCallback(() => {
    window.scrollTo({ top: 0 });
    setTimeout(() => window.scrollTo({ top: 0 }), 100);

    if (!centralContainerRef.current) return;

    const { current: centralContainer } = centralContainerRef;
    const blocks = centralContainer.querySelectorAll(".viewBlock");
    setBlocksCount(blocks.length);

    const intersectionObserver = new IntersectionObserver(
      ([intersection]) => {
        intersection.target.children[0].classList.add("activated");
      },
      {
        root: centralContainer,
        threshold: 0.3
      }
    );

    blocks.forEach(block => intersectionObserver.observe(block));

    blocks[0].classList.add("activated");

    console.log("load");
  }, [centralContainerRef.current]);

  useEffect(() => {
    document.body.removeEventListener("wheel", listenerWheel.current);

    listenerWheel.current = (e: WheelEvent) => {
      if (!blind) {
        setAccumulator(accumulator + e.deltaY);

        if (Math.abs(accumulator) > triggerScrollValue) {
          scroll(Math.sign(accumulator));
          setAccumulator(0);

          setBlind(true);
          setTimeout(() => setBlind(false), afterScrollBlindTime);
        }
      } else if (accumulator !== 0) setAccumulator(0);

      e.preventDefault();
    };

    document.body.addEventListener("wheel", listenerWheel.current, {
      passive: false
    });
  }, [accumulator, blind, setBlind]);

  return useMemo(
    () => (
      <>
        {/* <CentralContainer ref={centralContainerRef}> */}
        <CentralContainer>
          <ViewBlock
            first
            around={window.innerWidth > wideDisplayMinWidth}
            noSuspense
          >
            <ContentBlock>
              <Header onlyWoman />
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
            id={TagEnum.Collection}
            onLoadCallback={onLoadCallback}
          />

          <ViewBlock forced around id={TagEnum.Subscribe}>
            <SubscriptionBig />
          </ViewBlock>

          <ViewBlock noSnap forced around id={"contacts"}>
            <Footer />
          </ViewBlock>
          {/* <div
            style={{
              scrollSnapType: "start",
              scrollSnapStop: "always",
              height: 10,
              background: "green"
            }}
          /> */}
        </CentralContainer>
        <Header absolute noWoman />
        <EmailConfirmed />
      </>
    ),
    [onLoadCallback]
  );
});

export default MainPageReforged;
