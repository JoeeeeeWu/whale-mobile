/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import CellItem from '../../cell-item';
import Radio, { RadioProps } from '../index';
import './index.less';

interface RadioListProps extends RadioProps {
  value?: any;
  options: any[];
  alignCenter?: boolean;
  iconSize?: string;
  icon?: string;
  iconInverse?: string;
  iconDisabled?: string;
  iconSvg?: boolean;
  onChange?: Function;
}

const RadioList: React.FC<RadioListProps> = (props) => {
  const [selectedValue, setSelectedValue] = React.useState<any>('');
  const [inputSelected, setInputSelected] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const {
    value,
    options,
    alignCenter = false,
    children,
    iconSize = 'md',
    icon = 'checked',
    iconInverse = 'check',
    iconDisabled = 'check-disabled',
    iconSvg = false,
    onChange = () => {},
  } = props;
  const $_select = (option: any, index: any) => {
    setSelectedValue(option.value);
    setInputSelected(false);
    if (inputValue) {
      setInputValue('');
    }
    onChange(option, index);
  };
  const getCurrentValue = () => {
    if (inputSelected) {
      return inputValue;
    } else {
      return selectedValue;
    }
  };
  const currentValue = getCurrentValue();
  const withoutIcon = children && !icon;
  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  return (
    <div
      className={classnames('wm-radio-list', {
        'is-align-center': alignCenter,
      })}
    >
      {options?.map?.((item: any, index) => (
        <CellItem
          key={index}
          className={classnames('wm-radio-item', {
            'is-selected': selectedValue === item.value && !inputSelected,
          })}
          title={children ? '' : item.text || item.label}
          brief={children ? '' : item.brief}
          disabled={item.disabled}
          noBorder={index === options.length - 1}
          onClick={() => $_select(item, index)}
        >
          {React.isValidElement(children)
            ? React.cloneElement(children, {
                option: item,
                index,
                selected: currentValue === item.value,
              })
            : null}
          {!alignCenter && !inputSelected && !withoutIcon ? (
            <Radio
              name={item.value}
              value={selectedValue}
              disabled={item.disabled}
              size={iconSize}
              icon={icon}
              iconInverse={iconInverse}
              iconDisabled={iconDisabled}
              iconSvg={iconSvg}
              // :slot="iconPosition === 'right' ? 'right' : 'left'"
            />
          ) : null}
        </CellItem>
      ))}
      {/* <wm-input-item
        v-if="hasInput"
        ref="inputItem"
        class="wm-radio-item"
        :class="{
          'is-selected': inputSelected,
        }"
        :title="inputLabel"
        :placeholder="inputPlaceholder"
        v-model="inputValue"
        @focus="inputSelected = true"
      /> */}
    </div>
  );
};

export default RadioList;
