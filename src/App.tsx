import './App.scss';
import './i18n';

import { createBrowserHistory } from 'history';
import React, { lazy, Suspense, useMemo, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import smoothscroll from 'smoothscroll-polyfill';
import { createContainer } from 'unstated-next';

import BagsPage from './components/BagsPage';
import MainPageReforgedReforged from './components/MainPageReforgedReforged';
import UnsubscribePage from './components/UnsubscribePage';

const VARIABLES_GET_PATH = `${
  window.location.href.includes("localhost")
    ? "http://localhost:3000/"
    : window.location.href
}variables`;

// kick off the polyfill!
smoothscroll.polyfill();

export interface Variables {
  subscriptionCost: number;
}

function useVariables(): Variables {
  const [variables, setVariables] = useState<Variables>({
    subscriptionCost: 199
  });

  useMemo(
    () =>
      (async () => {
        try {
          const { subscriptionCost } = await (await fetch(VARIABLES_GET_PATH, {
            method: "GET"
          })).json();
          console.log(subscriptionCost);
          setVariables({ subscriptionCost: parseInt(subscriptionCost, 10) });
        } catch (e) {
          console.log(e);
        }
      })(),
    []
  );

  return variables;
}

export const VariablesContainer = createContainer(useVariables);

// import MainPage from './components/MainPage';
// import RegistrationsPage from './components/RegistrationsPage';
// const MainPage = lazy(() => import("./components/MainPage"));
const RegistrationsPage = lazy(() => import("./components/RegistrationsPage"));

const h = createBrowserHistory();
const App: React.FC = () => {
  // const [loaded, setLoaded] = useState(false);

  // window.addEventListener("load", () => setLoaded(true));

  return (
    <Router history={h}>
      <>
        <VariablesContainer.Provider>
          <Suspense fallback="">
            <Route exact path="/" component={MainPageReforgedReforged} />
          </Suspense>
          <Suspense fallback="">
            <Route path="/registrations" component={RegistrationsPage} />
          </Suspense>
          <Suspense fallback="">
            <Route path="/manageBags" component={BagsPage} />
          </Suspense>
          <Suspense fallback="">
            <Route path="/unsubscribe" component={UnsubscribePage} />
          </Suspense>
          <Suspense fallback="">
            <Route
              path="/verifyEmail/:pathParam?"
              component={MainPageReforgedReforged}
            />
          </Suspense>
        </VariablesContainer.Provider>
      </>
    </Router>
  );
};

export default App;
