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
