/* eslint-disable */

import React from 'react';
import classnames from 'classnames';
import Icon from '../icon';

interface RadioProps {
  disabled?: boolean;
  label?: string;
  iconSvg?: boolean;
  size?: string;
  name: any;
  value?: any;
}

const Radio: React.FC<RadioProps> = (props) => {
  const {
    disabled,
    isChecked,
    inline,
    size = 'md',
    iconSvg = false,
    children,
    label = '',
    name,
    value = '',
  } = props;
  const $_onClick = () => {};
  const isChecked = value === name || (this.rootGroup && this.rootGroup.value === name);
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={classnames('md-radio', {
        'is-disabled': disabled,
        'is-checked': isChecked,
        'is-inline': inline,
      })}
      onClick={$_onClick}
    >
      <div className="md-radio-icon">
        <Icon name={currentIcon} size={size} svg={iconSvg} />
      </div>
      {children || label ? <div className="md-radio-label">{children || label}</div> : null}
    </label>
  );
};

export default Radio;
