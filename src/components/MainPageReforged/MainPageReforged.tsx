import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import TagEnum from '../../types/TagEnum';
import StyleVariables from '../../variables.scss';
import CentralContainer from '../CentralContainer';
import ContentBlock from '../ContentBlock';
import Description from '../Description';
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

const MainPageReforged = React.memo(() => {
  const triggerScrollValue =
    window.innerWidth > mobileVersionMaxWidth ? 150 : 50;
  const afterScrollBlindTime =
    window.innerWidth > mobileVersionMaxWidth ? 600 : 300;

  const centralContainerRef = useRef<HTMLDivElement>(null);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blocksCount, setBlocksCount] = useState(0);
  const [accumulator, setAccumulator] = useState(0);
  const [previousScreenY, setPreviousScreenY] = useState<number | null>(null);
  const [blind, setBlind] = useState(false);

  const listenerTouchEnd = useRef((e: TouchEvent) => {
    /**/
  });
  const listenerTouchStart = useRef((e: TouchEvent) => {
    /**/
  });
  const listenerTouchMove = useRef((e: TouchEvent) => {
    /**/
  });
  const listenerWheel = useRef((e: WheelEvent) => {
    /**/
  });

  // console.log({ currentBlockIndex, blocksCount });

  const scroll = useCallback(
    (delta: number) => {
      const newBlockIndex = Math.min(
        blocksCount - 1,
        Math.max(currentBlockIndex + delta, 0)
      );

      console.log({ delta, currentBlockIndex, newBlockIndex });
      if (currentBlockIndex === newBlockIndex) return;

      setCurrentBlockIndex(newBlockIndex);

      if (!centralContainerRef.current) return;
      const blocks = centralContainerRef.current.querySelectorAll(".viewBlock");

      blocks[newBlockIndex].scrollIntoView({ behavior: "smooth" });
    },
    [currentBlockIndex, blocksCount]
  );

  const onLoadCallback = useCallback(() => {
    setTimeout(() => window.scrollTo({ top: 0 }), 1000);

    if (!centralContainerRef.current) return;

    const { current: centralContainer } = centralContainerRef;
    setBlocksCount(centralContainer.querySelectorAll(".viewBlock").length);

    console.log("load");
  }, [centralContainerRef.current]);

  useEffect(() => {
    document.body.removeEventListener("touchend", listenerTouchEnd.current);
    document.body.removeEventListener("touchstart", listenerTouchStart.current);
    document.body.removeEventListener("touchmove", listenerTouchMove.current);
    document.body.removeEventListener("wheel", listenerWheel.current);

    listenerTouchEnd.current = (e: TouchEvent) => {
      e.preventDefault();

      setPreviousScreenY(null);
    };

    listenerTouchStart.current = (e: TouchEvent) => {
      e.preventDefault();

      setPreviousScreenY(e.touches[0].screenY);
    };

    listenerTouchMove.current = (e: TouchEvent) => {
      e.preventDefault();
      // console.log({ accumulator, blind });

      const { screenY } = e.touches[0];
      const delta = previousScreenY === null ? 0 : screenY - previousScreenY;
      setPreviousScreenY(screenY);

      console.log({ screenY });

      if (!blind) {
        setAccumulator(accumulator + delta);

        if (Math.abs(accumulator) > triggerScrollValue) {
          scroll(Math.sign(accumulator) * -1);
          setAccumulator(0);

          setBlind(true);
          setTimeout(() => setBlind(false), afterScrollBlindTime);
        }
      } else if (accumulator !== 0) setAccumulator(0);
    };

    listenerWheel.current = (e: WheelEvent) => {
      setAccumulator(accumulator + e.deltaY);

      if (Math.abs(accumulator) > triggerScrollValue) {
        scroll(Math.sign(accumulator));
        setAccumulator(0);
      }

      e.preventDefault();
    };

    document.body.addEventListener("touchend", listenerTouchEnd.current, {
      passive: false
    });

    document.body.addEventListener("touchstart", listenerTouchStart.current, {
      passive: false
    });

    document.body.addEventListener("touchmove", listenerTouchMove.current, {
      passive: false
    });

    document.body.addEventListener("wheel", listenerWheel.current);
  }, [accumulator, previousScreenY, blind]);

  // useEffect(() => {
  //   document.body.addEventListener("touchup", () => {
  //     setBlind(true);
  //   });
  // }, [])

  return useMemo(
    () => (
      <>
        <CentralContainer ref={centralContainerRef}>
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

          <ViewBlock forced around id={"contacts"}>
            <Footer />
          </ViewBlock>
        </CentralContainer>
        <Header absolute noWoman />
      </>
    ),
    [onLoadCallback]
  );
});

export default MainPageReforged;
