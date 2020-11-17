import React from 'react';
import classnames from 'classnames';
import Icon from '../../icon';
import './index.less';

interface PopupTitleBarProps {
  title?: string;
  describe?: string;
  okText?: string;
  cancelText?: string;
  titleAlign?: string;
  largeRadius?: boolean;
  onlyClose?: boolean;
  onCancel?: Function;
  onConfirm?: Function;
}

const PopupTitleBar: React.FC<PopupTitleBarProps> = (props) => {
  const {
    title,
    describe,
    okText,
    cancelText,
    titleAlign,
    largeRadius,
    onlyClose,
    onCancel,
    onConfirm,
  } = props;
  const $_preventScroll = (e: any) => {
    e.preventDefault();
  };
  return (
    <div
      className={classnames('wm-popup-title-bar', `title-align-${titleAlign}`, {
        large: !!describe,
        'large-radius': largeRadius,
      })}
      onTouchMove={$_preventScroll}
    >
      {!onlyClose && cancelText ? (
        <div
          className="title-bar-left wm-popup-cancel"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          {cancelText}
        </div>
      ) : null}
      {title ? (
        <div className="title-bar-title">
          {title ? <p className="title">{title}</p> : null}
          {describe ? <p className="describe">{describe}</p> : null}
        </div>
      ) : null}
      {onlyClose ? (
        <div
          className="title-bar-right wm-popup-close"
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          <Icon name="close" size="lg" />
        </div>
      ) : (
        <div
          className="title-bar-right wm-popup-confirm"
          onClick={() => {
            if (onConfirm) {
              onConfirm();
            }
          }}
        >
          {okText}
        </div>
      )}
    </div>
  );
};

PopupTitleBar.defaultProps = {
  title: '',
  describe: '',
  okText: '',
  cancelText: '',
  titleAlign: 'center',
  largeRadius: false,
  onlyClose: false,
};

export default PopupTitleBar;
