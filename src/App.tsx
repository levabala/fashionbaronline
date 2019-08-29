import './App.scss';
import './i18n';

import { createBrowserHistory } from 'history';
import React from 'react';
import { Route, Router } from 'react-router-dom';

import MainPage from './components/MainPage';
import RegistrationsPage from './components/RegistrationsPage';

const App: React.FC = () => {
  const h = createBrowserHistory();
  return (
    <Router history={h}>
      <div className="App">
        <Route exact path="/" component={MainPage} />
        <Route path="/registrations" component={RegistrationsPage} />
      </div>
    </Router>
  );
};

export default App;
