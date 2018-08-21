import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';

import createHistory from 'history/createBrowserHistory';

import App from './components/App';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

import './favicon.ico';
import './styles/styles.scss';

render(
  <Router history={createHistory()}>
    <App>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="*" component={NotFoundPage}/>
      </Switch>
    </App>
  </Router>,
  document.getElementById('app')
);
