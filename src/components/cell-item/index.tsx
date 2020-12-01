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
  } = props;
  const $_onClick = () => {};
  return (
    <div
      className={classnames('wm-cell-item', {
        'is-disabled': disabled,
        'no-border': noBorder,
      })}
      onClick={$_onClick}
    >
      <div
        className={classnames('md-cell-item-body', {
          multilines: !!brief,
        })}
      >
        {left ? <div className="md-cell-item-left">{left}</div> : null}
        {title || brief || children ? (
          <div className="md-cell-item-content">
            {title ? <p className="md-cell-item-title">{title}</p> : null}
            {brief ? <p className="md-cell-item-brief">{brief}</p> : null}
            {children}
          </div>
        ) : null}
        {arrow || addon || right ? (
          <div className="md-cell-item-right">
            {right || addon}
            {arrow ? <Icon name="arrow-right" size="md" /> : null}
          </div>
        ) : null}
      </div>
      {extra ? <div className="md-cell-item-children">{extra}</div> : null}
    </div>
  );
};

export default CellItem;
