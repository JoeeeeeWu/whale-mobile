import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './dialog';

const noop = () => {};

const destroyFns: Array<() => void> = [];

Dialog.confirm = ({
  title = '',
  icon = '',
  iconSvg = false,
  content = '',
  cancelText = '取消',
  cancelWarning = false,
  confirmText = '确定',
  confirmWarning = false,
  closable = false,
  onConfirm = noop,
  onCancel = noop,
  onShow = noop,
  onHide = noop,
  transition = 'wm-bounce',
}: any) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  let currentConfig = {
    title,
    icon,
    iconSvg,
    content,
    cancelText,
    cancelWarning,
    confirmText,
    confirmWarning,
    closable,
    onConfirm,
    onCancel,
    onShow,
    onHide,
    transition,
    btns: [
      {
        text: cancelText,
        warning: cancelWarning,
        handler: /* istanbul ignore next */ () => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          close();
          if (onCancel() !== false) {
            // vm.close()
          }
        },
      },
      {
        text: confirmText,
        warning: confirmWarning,
        handler: /* istanbul ignore next */ () => {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          close();
          if (onConfirm() !== false) {
            // vm.close()
          }
        },
      },
    ],
    visible: true,
  } as any;

  const render = ({ ...props }: any) => {
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(props);
      ReactDOM.render(<Dialog {...props} />, div);
    });
  };

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
    }
    if (currentConfig.onCancel) {
      currentConfig.onCancel(...args);
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }

  const close = (...args: any[]) => {
    currentConfig = {
      ...currentConfig,
      visible: false,
      onHide: destroy.bind(this, ...args),
    };
    render(currentConfig);
  };

  render(currentConfig);
};

Dialog.succeed = (props: any) => {
  // eslint-disable-next-line no-param-reassign
  props.icon = 'success-color';
  // eslint-disable-next-line no-console
  console.log(props);
  return Dialog.confirm(props);
};

export default Dialog;
