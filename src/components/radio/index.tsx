/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Icon from '../icon';
import './index.less';

export interface RadioProps {
  disabled?: boolean;
  label?: string;
  iconSvg?: boolean;
  size?: string;
  name?: any;
  value?: any;
  iconDisabled?: string;
  iconInverse?: string;
  icon?: string;
  inline?: boolean;
}

const Radio: React.FC<RadioProps> = (props) => {
  const {
    disabled = false,
    size = 'md',
    iconSvg = false,
    children,
    label = '',
    name,
    value = '',
    iconDisabled = 'check-disabled',
    iconInverse = 'check',
    icon = 'checked',
    inline = false,
  } = props;
  const $_onClick = () => {};
  const isChecked = value === name;
  const currentIcon = disabled ? iconDisabled : isChecked ? icon : iconInverse;
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classnames('wm-radio', {
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-inline': inline,
      })}
      onClick={$_onClick}
    >
      <div className="wm-radio-icon">
        <Icon name={currentIcon} size={size} svg={iconSvg} />
      </div>
      {children || label ? <div className="wm-radio-label">{children || label}</div> : null}
    </label>
  );
};

export default Radio;
