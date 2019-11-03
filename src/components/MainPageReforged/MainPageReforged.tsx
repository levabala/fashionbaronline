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

// document.body.addEventListener("beforeunload", () =>
//   window.scrollTo({ top: 0 })
// );
window.history.scrollRestoration = "manual";
const initialWindowHeight = window.innerHeight;

const MainPageReforged = React.memo(() => {
  // const triggerScrollValue =
  //   window.innerWidth > mobileVersionMaxWidth ? 150 : 50;
  // const afterScrollBlindTime =
  //   window.innerWidth > mobileVersionMaxWidth ? 600 : 300;

  // const centralContainerRef = useRef<HTMLDivElement>(null);
  // const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  // const [blocksCount, setBlocksCount] = useState(0);
  // const [accumulator, setAccumulator] = useState(0);
  // const [previousScreenY, setPreviousScreenY] = useState<number | null>(null);
  // const [blind, setBlind] = useState(false);

  // const [resizeState, setResizeState] = useState(0);
  // const resizeStateDebounced = useDebounce(resizeState, 100);
  // const [
  //   resizeStateDebouncedPrevious,
  //   setResizeStateDebouncedPrevious
  // ] = useState(0);

  // const listenerResize = useRef((e: UIEvent) => {
  //   /**/
  // });
  // const listenerTouchEnd = useRef((e: TouchEvent) => {
  //   /**/
  // });
  // const listenerTouchStart = useRef((e: TouchEvent) => {
  //   /**/
  // });
  // const listenerTouchMove = useRef((e: TouchEvent) => {
  //   /**/
  // });
  // const listenerWheel = useRef((e: WheelEvent) => {
  //   /**/
  // });

  // const scroll = useCallback(
  //   (delta: number, scrollOnly = false) => {
  //     if (blind || !blocksCount) return;

  //     const newBlockIndex = Math.min(
  //       blocksCount - 1,
  //       Math.max(currentBlockIndex + delta, 0)
  //     );

  //     console.log({ delta, currentBlockIndex, newBlockIndex });
  //     // if (currentBlockIndex === newBlockIndex) return;

  //     if (!centralContainerRef.current) return;
  //     const blocks = centralContainerRef.current.querySelectorAll(".viewBlock");

  //     if (!blocks.length) return;

  //     const newBlock = blocks[newBlockIndex] as HTMLDivElement;
  //     newBlock.scrollIntoView({ behavior: "smooth", block: "start" });

  //     console.log(newBlock.offsetTop);

  //     if (scrollOnly) return;

  //     if (delta === -1) newBlock.classList.add("reactivated");
  //     else newBlock.classList.add("activated");
  //     newBlock.classList.remove("disactivated");

  //     if (newBlock.querySelector(".fashionGrid"))
  //       document.body.classList.add("collectionActive");
  //     else document.body.classList.remove("collectionActive");

  //     const previousBlock = blocks[currentBlockIndex];
  //     previousBlock.classList.add("disactivated");
  //     previousBlock.classList.remove("activated");
  //     previousBlock.classList.remove("reactivated");

  //     setCurrentBlockIndex(newBlockIndex);
  //   },
  //   [currentBlockIndex, blocksCount, blind]
  // );

  // (window as any).scrolll = scroll;

  // const scrollTo = (id: string) => {
  //   const centralContainer = centralContainerRef.current;
  //   if (!centralContainer) return;

  //   const targetBlockIndex = Array.from(centralContainer.children).findIndex(
  //     el => el.id === id
  //   );
  //   if (targetBlockIndex === -1) return;

  //   scroll(targetBlockIndex - currentBlockIndex);
  // };

  // //   (window as any).scrollPage = scrollPage;
  // (window as any).scrollTo = scrollTo;

  // const onLoadCallback = useCallback(() => {
  //   window.scrollTo({ top: 0 });
  //   setTimeout(() => window.scrollTo({ top: 0 }), 100);

  //   if (!centralContainerRef.current) return;

  //   const { current: centralContainer } = centralContainerRef;
  //   const blocks = centralContainer.querySelectorAll(".viewBlock");
  //   setBlocksCount(blocks.length);

  //   blocks[0].classList.add("activated");

  //   console.log("load");
  // }, [centralContainerRef.current]);

  // useEffect(() => {
  //   if (resizeStateDebouncedPrevious !== resizeStateDebounced) {
  //     setResizeStateDebouncedPrevious(resizeStateDebounced);
  //     console.log("resize");
  //   }
  // }, [resizeStateDebouncedPrevious, resizeStateDebounced]);

  // useEffect(() => {
  //   window.removeEventListener("resize", listenerResize.current);
  //   document.body.removeEventListener("touchend", listenerTouchEnd.current);
  //   document.body.removeEventListener("touchstart", listenerTouchStart.current);
  //   document.body.removeEventListener("touchmove", listenerTouchMove.current);
  //   document.body.removeEventListener("wheel", listenerWheel.current);

  //   listenerResize.current = (e: UIEvent) => {
  //     console.log({
  //       resizeState,
  //       resizeStateDebounced,
  //       resizeStateDebouncedPrevious
  //     });
  //     setResizeState(resizeState + 1);

  //     // if (keyboardShown) scroll(0, true);
  //     // setTimeout(() => scroll(0, true));
  //     // setTimeout(() => scroll(0, true), 1000);
  //   };

  //   listenerTouchEnd.current = (e: TouchEvent) => {
  //     // e.preventDefault();

  //     setPreviousScreenY(null);
  //     setAccumulator(0);
  //   };

  //   listenerTouchStart.current = (e: TouchEvent) => {
  //     // e.preventDefault();

  //     setPreviousScreenY(e.touches[0].screenY);
  //   };

  //   listenerTouchMove.current = (e: TouchEvent) => {
  //     e.preventDefault();
  //     // console.log({ accumulator, blind });

  //     const { screenY } = e.touches[0];
  //     const delta = previousScreenY === null ? 0 : screenY - previousScreenY;
  //     setPreviousScreenY(screenY);

  //     // console.log({ screenY });

  //     if (!blind) {
  //       setAccumulator(accumulator + delta);

  //       if (Math.abs(accumulator) > triggerScrollValue) {
  //         scroll(Math.sign(accumulator) * -1);
  //         setAccumulator(0);

  //         setBlind(true);
  //         setTimeout(() => setBlind(false), afterScrollBlindTime);
  //       }
  //     } else if (accumulator !== 0) setAccumulator(0);
  //   };

  //   listenerWheel.current = (e: WheelEvent) => {
  //     if (!blind) {
  //       setAccumulator(accumulator + e.deltaY);

  //       if (Math.abs(accumulator) > triggerScrollValue) {
  //         scroll(Math.sign(accumulator));
  //         setAccumulator(0);

  //         setBlind(true);
  //         setTimeout(() => setBlind(false), afterScrollBlindTime);
  //       }
  //     } else if (accumulator !== 0) setAccumulator(0);

  //     e.preventDefault();
  //   };

  //   window.addEventListener("resize", listenerResize.current);

  //   document.body.addEventListener("touchend", listenerTouchEnd.current, {
  //     passive: true
  //   });

  //   document.body.addEventListener("touchstart", listenerTouchStart.current, {
  //     passive: true
  //   });

  //   document.body.addEventListener("touchmove", listenerTouchMove.current, {
  //     passive: false
  //   });

  //   document.body.addEventListener("wheel", listenerWheel.current, {
  //     passive: false
  //   });
  // }, [
  //   accumulator,
  //   previousScreenY,
  //   blind,
  //   setBlind,
  //   resizeStateDebounced,
  //   resizeState
  // ]);

  // useEffect(() => {
  //   document.body.addEventListener("touchup", () => {
  //     setBlind(true);
  //   });
  // }, [])

  const qwe = () => null;

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

          <FashionGrid id={TagEnum.Collection} onLoadCallback={qwe} />

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
    [qwe]
  );
});

export default MainPageReforged;
