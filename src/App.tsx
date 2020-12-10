import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import ButtonPage from './pages/button';
import DropMenuPage from './pages/drop-menu';
import PopupPage from './pages/popup';
import DialogPage from './pages/dialog';
import PickerPage from './pages/picker';
import ScrollViewPage from './pages/scroll-view';
import CellItemPage from './pages/cell-item';
import TabsPage from './pages/tabs';
import './global.less';

const App: React.FC<{}> = () => (
  <Router history={history}>
    <Switch>
      <Route path="/button" component={ButtonPage} />
      <Route path="/drop-menu" component={DropMenuPage} />
      <Route path="/popup" component={PopupPage} />
      <Route path="/dialog" component={DialogPage} />
      <Route path="/picker" component={PickerPage} />
      <Route path="/scroll-view" component={ScrollViewPage} />
      <Route path="/cell-item" component={CellItemPage} />
      <Route path="/tabs" component={TabsPage} />
    </Switch>
  </Router>
);

export default App;
