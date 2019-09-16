import './App.scss';
import './i18n';

import { createBrowserHistory } from 'history';
import React, { lazy, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';

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
        <Suspense fallback="">
          <Route exact path="/" component={MainPage} />
        </Suspense>
        <Suspense fallback="">
          <Route path="/registrations" component={RegistrationsPage} />
        </Suspense>
      </div>
    </Router>
  );
};

export default App;
