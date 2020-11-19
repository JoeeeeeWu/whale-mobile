/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Popup from '../popup';
import PopupTitleBar from '../popup/title-bar';
import PickerColumn from './picker-column';

interface PickerProps {
  isView?: boolean;
}

const Picker: React.FC<PickerProps> = (props) => {
  const { isView } = props;
  return (
    <div
      className={classnames('wm-picker', {
        'with-popup': !isView,
      })}
    >
      {/* {isView ? (
        <PickerColumn
          ref="pickerColumn"
          :data="data"
          :default-value="defaultValue"
          :default-index="defaultIndex"
          :invalid-index="invalidIndex"
          :line-height="lineHeight"
          :keep-index="keepIndex"
          :cols="cols"
          @initialed="$emit('initialed')"
          @change="$_onPickerChange"
        />
      ) : (
        <Popup
          ref="popup"
          className="inner-popup"
          v-model="isPickerShow"
          position="bottom"
          :mask-closable="maskClosable"
          @beforeShow="$_onPickerBeforeShow"
          @show="$_onPickerShow"
          @hide="$_onPickerHide"
          @maskClick="$_onPickerCancel"
          prevent-scroll
        >
          <PopupTitleBar
            :title="title"
            :describe="describe"
            :ok-text="okText"
            :cancel-text="cancelText"
            :large-radius="largeRadius"
            @confirm="$_onPickerConfirm"
            @cancel="$_onPickerCancel"
          />
          <PickerColumn
            ref="pickerColumn"
            :data="data"
            :default-value="$_getDefaultValue()"
            :default-index="$_getDefaultIndex()"
            :invalid-index="invalidIndex"
            :line-height="lineHeight"
            :keep-index="keepIndex"
            :cols="cols"
            @initialed="$_onPickerInitialed"
            @change="$_onPickerChange"
          />
        </Popup>
      )} */}
    </div>
  );
};

Picker.defaultProps = {
  isView: false,
};

export default Picker;
