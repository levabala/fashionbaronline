import './App.scss';
import './i18n';

import { createBrowserHistory } from 'history';
import React, { lazy, Suspense, useMemo, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import { createContainer } from 'unstated-next';

const VARIABLES_GET_PATH = `${
  window.location.href.includes("localhost")
    ? "http://localhost:3000/"
    : window.location.href
}variables`;

export interface Variables {
  subscriptionCost: number;
}

function useVariables(): Variables {
  const [variables, setVariables] = useState<Variables>({
    subscriptionCost: 100
  });

  useMemo(
    () =>
      (async () => {
        const { subscriptionCost } = await (await fetch(VARIABLES_GET_PATH, {
          method: "GET"
        })).json();
        console.log(subscriptionCost);
        setVariables({ subscriptionCost: parseInt(subscriptionCost, 10) });
      })(),
    []
  );

  return variables;
}

export const VariablesContainer = createContainer(useVariables);

// import MainPage from './components/MainPage';
// import RegistrationsPage from './components/RegistrationsPage';
const MainPage = lazy(() => import("./components/MainPage"));
const RegistrationsPage = lazy(() => import("./components/RegistrationsPage"));

const h = createBrowserHistory();
const App: React.FC = () => {
  // const [loaded, setLoaded] = useState(false);

  // window.addEventListener("load", () => setLoaded(true));

  return (
    <Router history={h}>
      <div
        className="App"
        // style={{ visibility: loaded ? "visible" : "hidden" }}
      >
        <VariablesContainer.Provider>
          <Suspense fallback="">
            <Route exact path="/" component={MainPage} />
          </Suspense>
          <Suspense fallback="">
            <Route path="/registrations" component={RegistrationsPage} />
          </Suspense>
        </VariablesContainer.Provider>
      </div>
    </Router>
  );
};

export default App;
