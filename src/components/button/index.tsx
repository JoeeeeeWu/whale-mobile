import React from 'react';
import classnames from 'classnames';
import Icon from '../icon';
import ActivityIndicatorRolling from '../activity-indicator/roller';
import './index.less';

type ButtonProps = {
  type?: 'default' | 'primary' | 'warning' | 'disabled' | 'link';
  nativeType?: 'button' | 'submit' | 'reset';
  round?: boolean;
  plain?: boolean;
  size?: 'large' | 'small';
  inactive?: boolean;
  inline?: boolean;
  loading?: boolean;
  icon?: string;
  iconSvg?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
} & Omit<React.ButtonHTMLAttributes<any>, 'type' | 'onClick'>;

const Button: React.FC<ButtonProps> = (props) => {
  const {
    nativeType,
    type,
    round,
    plain,
    size,
    inactive,
    inline,
    loading,
    icon,
    iconSvg,
    children,
  } = props;
  const iconNode = icon ? <Icon name={icon} svg={iconSvg} /> : null;
  const classes = classnames(
    'wm-button',
    type,
    inactive ? 'inactive' : 'active',
    inline ? 'inline' : 'block',
    {
      round,
      plain,
      small: size === 'small',
    },
  );
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) => {
    const { onClick } = props;
    if (loading) {
      return;
    }
    if (onClick) {
      (onClick as React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(e);
    }
  };
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={nativeType}
      className={classes}
      disabled={inactive || type === 'disabled'}
      onClick={handleClick}
      v-on="$listeners"
    >
      <div className="wm-button-inner">
        {loading ? <ActivityIndicatorRolling className="wm-button-loading" /> : iconNode}
        <div className="md-button-content">{children}</div>
      </div>
    </button>
  );
};

Button.defaultProps = {
  nativeType: 'button',
  type: 'default',
  round: false,
  plain: false,
  size: 'large',
  inactive: false,
  inline: false,
  loading: false,
  icon: '',
  iconSvg: false,
};

export default Button;
