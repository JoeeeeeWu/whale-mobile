import React from 'react';
import classnames from 'classnames';
import ActivityIndicatorRolling from '../activity-indicator/roller';

interface ButtonProps {
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
}

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
  const iconDom = icon ? <Icon name={icon} svg={iconSvg} /> : null;
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={nativeType}
      className={classnames(
        'wm-button',
        type,
        inactive ? 'inactive' : 'active',
        inline ? 'inline' : 'block',
        {
          'round': round,
          'plain': plain,
          'small': size === 'small',
        },
      )}
      disabled={inactive || type === 'disabled'}
      v-on="$listeners"
    >
      <div className="wm-button-inner">
        { loading ? <ActivityIndicatorRolling className="wm-button-loading" /> : iconDom }
        <div className="md-button-content">
          {children}
        </div>
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
