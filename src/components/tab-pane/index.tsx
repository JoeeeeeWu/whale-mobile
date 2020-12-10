import React from 'react';
import Transition from '../transition';

interface TabPaneProps {
  label?: string;
  name?: string;
  disabled?: boolean;
}

const TabPane: React.FC<TabPaneProps> = (props) => {
  const {
    // name,
    children,
  } = props;
  return (
    <Transition visible={active} name={transitionName}>
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
