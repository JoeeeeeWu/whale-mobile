import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './index.less';

interface FieldProps {
  plain?: boolean;
  disabled?: boolean;
  title?: string;
  brief?: string;
  header?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
}

const Field: React.FC<FieldProps> = (props) => {
  const {
    plain = false,
    disabled = false,
    children,
    title = '',
    brief = '',
    header,
    action,
    footer,
  } = props;
  return (
    <fieldset
      className={classnames('wm-field', {
        'is-plain': plain,
        'is-disabled': disabled,
      })}
    >
      {title || brief || header || action ? (
        <header className="wm-field-header" v-if="title || brief || header || action">
          <div className="wm-field-heading">
            {title ? (
              <legend v-if="title" className="wm-field-title">
                {title}
              </legend>
            ) : null}
            {brief ? <p className="wm-field-brief">{brief}</p> : null}
            {header}
          </div>
          <div className="wm-field-action">{action}</div>
        </header>
      ) : null}
      <div className="wm-field-content">{children}</div>
      {footer ? <footer className="wm-field-footer">{footer}</footer> : null}
    </fieldset>
  );
};

export default Field;
