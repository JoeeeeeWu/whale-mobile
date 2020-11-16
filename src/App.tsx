import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ButtonPage from './pages/button';
import DropMenuPage from './pages/drop-menu';
import PopupPage from './pages/popup';

const App: React.FC<{}> = () => (
  <Router history={history}>
    <Switch>
      <Route path="/button" component={ButtonPage} />
      <Route path="/drop-menu" component={DropMenuPage} />
      <Route path="/popup" component={PopupPage} />
    </Switch>
  </Router>
);

export default App;
