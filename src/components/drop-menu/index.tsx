import React from 'react';
import classnames from 'classnames';
import './index.less';

interface DropMenuProps {
  data: any[];
}

const DropMenu: React.FC<DropMenuProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedMenuListItem, setSelectedMenuListItem] = React.useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeMenuBarIndex, setActiveMenuBarIndex] = React.useState<number>(-1);
  const { data } = props;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_checkBarItemSelect = (index: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const $_onBarItemClick = (barItem: any, index: number) => {};
  const $_getBarItemText = (item: any, index: number) => {
    return selectedMenuListItem[index] !== undefined ? selectedMenuListItem[index].text : item.text;
  };
  return (
    <div className="wm-drop-menu">
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
      {/* <wm-popup
        v-model="isPopupShow"
        position="top"
        prevent-scroll
        :prevent-scroll-exclude="scroller"
        @show="$_onListShow"
        @hide="$_onListHide"
        @before-hide="$_onListBeforeHide"
      >
        <div className="wm-drop-menu-list">
          <wm-radio-list
            v-model="selectedMenuListValue[activeMenuBarIndex]"
            :options="activeMenuListData"
            :is-slot-scope="hasSlot"
            align-center
            @change="$_onListItemClick"
          >
            <div slot-scope="{ option }">
              <slot :option="option"></slot>
            </div>
          </wm-radio-list>
        </div>
      </wm-popup> */}
    </div>
  );
};

export default DropMenu;
