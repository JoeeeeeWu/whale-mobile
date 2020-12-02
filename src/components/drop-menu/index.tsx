/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Popup from '../../components/popup';
import RadioList from '../radio/list';
import './index.less';

interface DropMenuProps {
  data: any[];
  className?: string;
  onChange?: Function;
}

const DropMenu: React.FC<DropMenuProps> = (props) => {
  const { onChange = () => {} } = props;
  const [isPopupShow, setIsPopupShow] = React.useState<boolean>(false);
  const [scroller, setScroller] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMenuListItem, setSelectedMenuListItem] = React.useState<any[]>([]);
  const [selectedMenuListValue, setSelectedMenuListValue] = React.useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeMenuBarIndex, setActiveMenuBarIndex] = React.useState<number>(-1);
  const { data, className } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_checkBarItemSelect = (index: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_onBarItemClick = (barItem: any, index: number) => {
    if (!barItem || barItem.disabled) {
      return;
    }

    if (!isPopupShow) {
      setIsPopupShow(true);
      setActiveMenuBarIndex(index);
    } else {
      setIsPopupShow(false);
    }
  };

  const $_getBarItemText = (item: any, index: number) => {
    return selectedMenuListItem[index] !== undefined ? selectedMenuListItem[index].text : item.text;
  };

  const $_onListShow = () => {};

  const $_onListHide = () => {};

  const $_onListBeforeHide = () => {};

  const $_onListItemClick = (listItem: any) => {
    const barItem = data[activeMenuBarIndex];
    setIsPopupShow(false);
    selectedMenuListValue[activeMenuBarIndex] = listItem.value;
    setSelectedMenuListValue([...selectedMenuListValue]);
    selectedMenuListItem[activeMenuBarIndex] = listItem;
    setSelectedMenuListItem([...selectedMenuListItem]);
    onChange(barItem, listItem);
  };

  const getActiveMenuListData = () => {
    if (activeMenuBarIndex < 0 || !data[activeMenuBarIndex]) {
      return [];
    }

    return data[activeMenuBarIndex].options;
  };
  const activeMenuListData = getActiveMenuListData();

  return (
    <div className={classnames('wm-drop-menu', className)}>
      <div className="wm-drop-menu-bar">
        {data.map((item, index) => (
          <div
            key={index}
            className={classnames('bar-item', {
              active: index === activeMenuBarIndex,
              selected: $_checkBarItemSelect(index),
              disabled: item.disabled,
            })}
            onClick={() => $_onBarItemClick(item, index)}
          >
            <span>{$_getBarItemText(item, index)}</span>
          </div>
        ))}
      </div>
      <Popup
        visible={isPopupShow}
        position="top"
        preventScroll
        preventScrollExclude={scroller}
        onShow={$_onListShow}
        onHide={$_onListHide}
        onBeforeHide={$_onListBeforeHide}
      >
        <div className="wm-drop-menu-list">
          <RadioList
            value={selectedMenuListValue[activeMenuBarIndex]}
            options={activeMenuListData}
            alignCenter
            onChange={$_onListItemClick}
          >
            {/* <div slot-scope="{ option }">
              <slot :option="option"></slot>
            </div> */}
          </RadioList>
        </div>
      </Popup>
    </div>
  );
};

export default DropMenu;
