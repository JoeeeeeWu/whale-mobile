import React, { ReactElement } from 'react';
import classnames from 'classnames';
import Icon from '../icon';
import './index.less';

interface CellItemProps {
  title?: string;
  brief?: string;
  addon?: string;
  arrow?: boolean;
  disabled?: boolean;
  noBorder?: boolean;
  left?: ReactElement;
  right?: ReactElement;
  extra?: ReactElement;
  className?: string;
  onClick?: Function;
}

const CellItem: React.FC<CellItemProps> = (props) => {
  const {
    title = '',
    brief = '',
    addon = '',
    arrow = false,
    disabled = false,
    noBorder = false,
    left,
    right,
    extra,
    children,
    className,
    onClick = () => {},
  } = props;
  const $_onClick = (e: any) => {
    onClick(e);
  };
  return (
    <div
      className={classnames('wm-cell-item', className, {
        'is-disabled': disabled,
        'no-border': noBorder,
      })}
      onClick={$_onClick}
    >
      <div
        className={classnames('wm-cell-item-body', {
          multilines: !!brief,
        })}
      >
        {left ? <div className="wm-cell-item-left">{left}</div> : null}
        {title || brief || children ? (
          <div className="wm-cell-item-content">
            {title ? <p className="wm-cell-item-title">{title}</p> : null}
            {brief ? <p className="wm-cell-item-brief">{brief}</p> : null}
            {children}
          </div>
        ) : null}
        {arrow || addon || right ? (
          <div className="wm-cell-item-right">
            {right || addon}
            {arrow ? <Icon name="arrow-right" size="md" /> : null}
          </div>
        ) : null}
      </div>
      {extra ? <div className="wm-cell-item-children">{extra}</div> : null}
    </div>
  );
};

export default CellItem;
