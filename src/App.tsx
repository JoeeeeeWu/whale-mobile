import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';

const App: React.FC<{}> = () => (
  <Router history={history}>
    <Switch>
      {/* <Route path="/login" component={LoginPage} />
      <Route path="/" component={IndexPage} /> */}
    </Switch>
  </Router>
);

export default App;
