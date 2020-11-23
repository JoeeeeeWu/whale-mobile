/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Popup, { PopupProps } from '../popup';
import PopupTitleBar, { PopupTitleBarProps } from '../popup/title-bar';
import PickerColumn from './picker-column';
// import forwardRef from '../forward-ref';
import { noop, getDpr, traverse, inArray, extend, warn } from '../util';
import './index.less';

// const ForwardRefPickerColumn = forwardRef(PickerColumn);

interface PickerProps extends PopupProps, PopupTitleBarProps {
  isView?: boolean;
  data?: any[];
  cols?: number;
  defaultValue?: any[];
  defaultIndex?: any[];
  invalidIndex?: any[];
  keepIndex?: boolean;
  lineHeight?: number;
  onInitialed?: Function;
}

const Picker: React.FC<PickerProps> = (props) => {
  const [oldActivedIndexs, setOldActivedIndexs] = React.useState(null);
  const [isPickerShow, setPickerShow] = React.useState<boolean>(false);
  const [isPickerFirstPopup, setPickerFirstPopup] = React.useState<boolean>(true);
  const columnRef = React.useRef(null);
  const {
    isView = false,
    data = [],
    title,
    cols = 1,
    defaultValue = [],
    maskClosable,
    defaultIndex = [],
    invalidIndex = [],
    keepIndex = false,
    lineHeight,
    onInitialed,
    describe,
    okText,
    cancelText,
    largeRadius,
    visible,
  } = props;
  const $_onPickerChange = () => {};
  const $_onPickerBeforeShow = () => {};
  const $_onPickerShow = () => {};
  const $_onPickerHide = () => {};
  const $_onPickerCancel = () => {};
  const $_onPickerConfirm = () => {};
  const $_getDefaultValue = () => {
    return oldActivedIndexs ? [] : defaultValue;
  };
  const $_getDefaultIndex = () => {
    return oldActivedIndexs || defaultIndex;
  };
  const $_onPickerInitialed = () => {};

  const $_initPicker = () => {
    if (!isView && visible) {
      setPickerShow(visible);
    }

    // columnRef?.current?.inheritPickerApi?.(this, ['refresh'])

    if (isPickerFirstPopup) {
      setPickerFirstPopup(false);
    } else {
      // mark initial activedIndexs as snapshoot
      setTimeout(() => {
        setOldActivedIndexs(extend([], columnRef?.current?.activedIndexs));
      }, 100);
    }
  };

  React.useEffect(() => {
    $_initPicker();
    if (isView) {
      columnRef.current.refresh();
    }
  }, []);

  return (
    <div
      className={classnames('wm-picker', {
        'with-popup': !isView,
      })}
    >
      {isView ? (
        <PickerColumn
          // ref="pickerColumn"
          ref={columnRef}
          data={data}
          defaultValue={defaultValue}
          defaultIndex={defaultIndex}
          invalidIndex={invalidIndex}
          lineHeight={lineHeight}
          keepIndex={keepIndex}
          cols={cols}
          onInitialed={onInitialed}
          onChange={$_onPickerChange}
        />
      ) : (
        <Popup
          // ref="popup"
          className="inner-popup"
          v-model="isPickerShow"
          position="bottom"
          maskClosable={maskClosable}
          onBeforeShow={$_onPickerBeforeShow}
          onShow={$_onPickerShow}
          onHide={$_onPickerHide}
          onMaskClick={$_onPickerCancel}
          prevent-scroll
        >
          <PopupTitleBar
            title={title}
            describe={describe}
            okText={okText}
            cancelText={cancelText}
            largeRadius={largeRadius}
            onConfirm={$_onPickerConfirm}
            onCancel={$_onPickerCancel}
          />
          <PickerColumn
            // ref="pickerColumn"
            data={data}
            defaultValue={$_getDefaultValue()}
            defaultIndex={$_getDefaultIndex()}
            invalidIndex={invalidIndex}
            lineHeight={lineHeight}
            keepIndex={keepIndex}
            cols={cols}
            onInitialed={$_onPickerInitialed}
            onChange={$_onPickerChange}
          />
        </Popup>
      )}
    </div>
  );
};

Picker.defaultProps = {
  isView: false,
};

export default Picker;
