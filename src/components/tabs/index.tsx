import React from 'react';
import TabsContext from './TabsContext';
import TabBar from '../tab-bar';
import './index.less';

interface TabsProps {
  value?: string;
}

const Tabs: React.FC<TabsProps> = (props) => {
  const [currentName, setCurrentName] = React.useState<string | number>('');
  const [prevIndex] = React.useState<number>(0);
  const [panes, setPanes] = React.useState<any[]>([]);
  const { value = '', children } = props;

  const menus = panes.map((pane: any) => ({
    name: pane.name,
    label: pane.label,
    disabled: pane.disabled,
  }));

  const getCurrentIndex = () => {
    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = menus.length; i < len; i++) {
      if (menus[i].name === currentName) {
        return i;
      }
    }
    return 0;
  };

  const currentIndex = getCurrentIndex();

  const $_addPane = (pane: any) => {
    if (panes.findIndex((item: any) => item.name === pane.name) === -1) {
      panes.push(pane);
      setPanes([...panes]);
    }
  };

  React.useEffect(() => {
    setCurrentName(value);
  }, [value]);

  React.useEffect(() => {
    if (!currentName && menus.length) {
      setCurrentName(menus[0].name);
    }
  }, [menus]);

  return (
    <TabsContext.Provider value={{ currentName, prevIndex, currentIndex, $_addPane }}>
      <div className="wm-tabs">
        <TabBar />
      </div>
      <div className="wm-tabs-content">{children}</div>
    </TabsContext.Provider>
  );
};

export default Tabs;
