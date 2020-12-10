import React from 'react';
import Transition from '../transition';
import TabsContext from '../tabs/TabsContext';

interface TabPaneProps {
  label?: string;
  name?: string;
  disabled?: boolean;
}

const TabPane: React.FC<TabPaneProps> = (props) => {
  const { name, children } = props;
  const { currentName, prevIndex, currentIndex, $_addPane } = React.useContext(TabsContext);
  const active = currentName === name;
  const transitionName = prevIndex > currentIndex ? 'wm-tab-slide-right' : 'wm-tab-slide-left';
  React.useEffect(() => {
    $_addPane({
      name,
    });
  }, []);
  return (
    <Transition visible={active} name={transitionName} timeout={250}>
      <div
        className="wm-tab-pane"
        role="tabpanel"
        // tab={name}
      >
        {children}
      </div>
    </Transition>
  );
};

export default TabPane;
