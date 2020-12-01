/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Popup from '../../components/popup';
import './index.less';

interface DropMenuProps {
  data: any[];
  className?: string;
}

const DropMenu: React.FC<DropMenuProps> = (props) => {
  const [isPopupShow, setIsPopupShow] = React.useState<boolean>(false);
  const [scroller, setScroller] = React.useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMenuListItem, setSelectedMenuListItem] = React.useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeMenuBarIndex, setActiveMenuBarIndex] = React.useState<number>(-1);
  const { data, className } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_checkBarItemSelect = (index: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_onBarItemClick = (barItem: any, index: number) => {};

  const $_getBarItemText = (item: any, index: number) => {
    return selectedMenuListItem[index] !== undefined ? selectedMenuListItem[index].text : item.text;
  };

  const $_onListShow = () => {};

  const $_onListHide = () => {};

  const $_onListBeforeHide = () => {};

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
          {/* <wm-radio-list
            v-model="selectedMenuListValue[activeMenuBarIndex]"
            :options="activeMenuListData"
            :is-slot-scope="hasSlot"
            align-center
            @change="$_onListItemClick"
          >
            <div slot-scope="{ option }">
              <slot :option="option"></slot>
            </div>
          </wm-radio-list> */}
        </div>
      </Popup>
    </div>
  );
};

export default DropMenu;
