import React from 'react';
import classnames from 'classnames';
import Popup from '../popup';
import Icon from '../icon';
import ActivityIndicatorRolling from '../activity-indicator/roller';
import './index.less';

interface DialogProps {
  visible?: boolean;
  title?: string;
  icon?: string;
  iconSvg?: boolean;
  closable?: boolean;
  content?: string;
  btns?: any[];
  layout?: string;
  appendTo?: Function;
  hasMask?: boolean;
  maskClosable?: boolean;
  transition?: string;
  preventScroll?: boolean;
  preventScrollExclude?: string;
  header?: any;
  onHide?: () => void;
}

const Dialog: React.FC<DialogProps> & DialogFC = (props) => {
  const {
    visible,
    hasMask,
    header,
    closable,
    icon,
    iconSvg,
    title,
    layout,
    btns,
    onHide,
    maskClosable,
    transition,
    content,
    children,
  } = props;
  const close = () => {
    if (onHide) {
      onHide();
    }
  };
  const $_onClick = (btn: any) => {
    if (btn.disabled || btn.loading) {
      return;
    }
    if (typeof btn.handler === 'function') {
      btn.handler.call(null, btn);
    } else {
      close();
    }
  };
  return (
    <div className="wm-dialog">
      <Popup
        visible={visible}
        hasMask={hasMask}
        maskClosable={maskClosable}
        onHide={onHide}
        position="center"
        transition={transition}
      >
        <div className="wm-dialog-content">
          {header}
          <div className="wm-dialog-body">
            {closable ? (
              // eslint-disable-next-line jsx-a11y/interactive-supports-focus
              <a
                role="button"
                className="wm-dialog-close"
                // tabIndex={0}
                onClick={close}
              >
                <Icon name="close" />
              </a>
            ) : null}
            {icon ? (
              <div className="wm-dialog-icon">
                <Icon name={icon} svg={iconSvg} />
              </div>
            ) : null}
            {title ? <h2 className="wm-dialog-title">{title}</h2> : null}
            <div className="wm-dialog-text">{content || children}</div>
          </div>
          <footer
            className={classnames('wm-dialog-actions', {
              'is-column': layout === 'column',
            })}
          >
            {btns &&
              btns.map &&
              btns.map((btn: any) => {
                const iconNode = btn.icon ? (
                  <Icon
                    className="wm-dialog-btn-icon"
                    name={btn.icon}
                    svg={btn.iconSvg}
                    size="md"
                  />
                ) : null;
                return (
                  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                  <a
                    role="button"
                    className={classnames('wm-dialog-btn', {
                      disabled: !!btn.disabled,
                      warning: !btn.disabled && !!btn.warning,
                    })}
                    key={btn.text}
                    // tabIndex={0}
                    onClick={() => $_onClick(btn)}
                    onTouchMove={(event: React.TouchEvent<HTMLAnchorElement>) =>
                      event.preventDefault()
                    }
                  >
                    {btn.loading ? (
                      <ActivityIndicatorRolling className="wm-dialog-btn-loading" />
                    ) : (
                      iconNode
                    )}
                    {btn.text}
                  </a>
                );
              })}
          </footer>
        </div>
      </Popup>
    </div>
  );
};

Dialog.defaultProps = {
  visible: false,
  title: '',
  icon: '',
  iconSvg: false,
  closable: true,
  content: '',
  btns: [],
  layout: 'row',
  appendTo: () => window.document.body,
  hasMask: true,
  maskClosable: false,
  transition: 'wm-fade',
  preventScroll: false,
  preventScrollExclude: '',
  onHide: () => '',
  content: '',
};

export default Dialog;
