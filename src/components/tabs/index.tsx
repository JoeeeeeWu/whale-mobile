import React from 'react';
import TabsContext from './TabsContext';
import TabBar from '../tab-bar';
import './index.less';

interface TabsProps {}

const Tabs: React.FC<TabsProps> = (props) => {
  const { children } = props;
  return (
    <TabsContext.Provider value={1}>
      <div className="wm-tabs">
        <TabBar />
      </div>
      <div className="wm-tabs-content">{children}</div>
    </TabsContext.Provider>
  );
};

export default Tabs;
