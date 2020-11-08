import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ButtonPage from './pages/button';

const App: React.FC<{}> = () => (
  <Router history={history}>
    <Switch>
      <Route path="/button" component={ButtonPage} />
    </Switch>
  </Router>
);

export default App;
