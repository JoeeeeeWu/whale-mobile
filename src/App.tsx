import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ButtonPage from './pages/button';
import DropMenuPage from './pages/drop-menu';
import PopupPage from './pages/popup';
import DialogPage from './pages/dialog';

const App: React.FC<{}> = () => (
  <Router history={history}>
    <Switch>
      <Route path="/button" component={ButtonPage} />
      <Route path="/drop-menu" component={DropMenuPage} />
      <Route path="/popup" component={PopupPage} />
      <Route path="/dialog" component={DialogPage} />
    </Switch>
  </Router>
);

export default App;
