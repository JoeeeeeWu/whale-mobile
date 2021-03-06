import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import Transition from '../transition';
import './index.less';

export interface PopupProps {
  visible?: boolean;
  hasMask?: boolean;
  maskClosable?: boolean;
  position?: string;
  transition?: string;
  preventScroll?: boolean;
  preventScrollExclude?: string | Function;
  largeRadius?: boolean;
  onBeforeHide?: Function;
  onBeforeShow?: Function;
  hide?: Function;
  onShow?: Function;
  onHide?: Function;
  className?: string;
  onMaskClick?: Function;
}

const Popup: React.FC<PopupProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPopupShow, setPopupShow] = React.useState<boolean>(false);
  const [isPopupBoxShow, setPopupBoxShow] = React.useState<boolean>(false);
  const [isAnimation, setAnimation] = React.useState<boolean>(false);
  const popupRef = React.useRef(null);
  const {
    visible,
    preventScroll,
    preventScrollExclude,
    position,
    hasMask,
    largeRadius,
    transition,
    onBeforeHide,
    onBeforeShow,
    hide,
    onShow,
    onHide,
    maskClosable,
    children,
    className,
    onMaskClick = () => {},
  } = props;
  const $_preventDefault = (event: any) => {
    event.preventDefault();
  };
  const $_stopImmediatePropagation = (event: any) => {
    event.stopImmediatePropagation();
  };
  const $_preventScrollExclude = (isBind: boolean, exclude?: string | Function) => {
    const handler = isBind ? 'addEventListener' : 'removeEventListener';
    // eslint-disable-next-line no-param-reassign
    exclude = exclude || preventScrollExclude;
    const excluder =
      exclude && typeof exclude === 'string'
        ? popupRef?.current?.querySelector(preventScrollExclude)
        : exclude;
    if (excluder) {
      // eslint-disable-next-line no-debugger
      // debugger
      excluder[handler]('touchmove', $_stopImmediatePropagation, false);
    }
  };
  const $_preventScroll = (isBind: boolean) => {
    const handler = isBind ? 'addEventListener' : 'removeEventListener';
    const masker = popupRef?.current?.querySelector('.wm-popup-mask');
    const boxer = popupRef?.current?.querySelector('.wm-popup-box');
    if (masker) {
      masker[handler]('touchmove', $_preventDefault, false);
    }
    if (boxer) {
      boxer[handler]('touchmove', $_preventDefault, false);
    }
    $_preventScrollExclude(isBind);
  };
  const $_showPopupBox = () => {
    setPopupShow(true);
    setAnimation(true);
    // popup box enter the animation after popup show
    setPopupBoxShow(true);
    if (preventScroll) {
      $_preventScroll(true);
    }
  };
  const $_hidePopupBox = () => {
    setAnimation(true);
    setPopupBoxShow(false);
    if (preventScroll) {
      $_preventScroll(false);
    }
    // if (onHide) {
    //   onHide();
    // }
  };
  const $_onPopupMaskClick = () => {
    if (maskClosable) {
      $_hidePopupBox();
      // this.$emit('maskClick')
      onMaskClick();
    }
  };
  const $_onPopupTransitionStart = () => {
    if (!isPopupBoxShow) {
      if (onBeforeHide) {
        onBeforeHide();
      }
    } else if (onBeforeShow) {
      onBeforeShow();
    }
  };

  const $_onPopupTransitionEnd = () => {
    if (!isAnimation) {
      return;
    }
    if (!isPopupBoxShow) {
      // popup hide after popup box finish animation
      setPopupShow(false);
      if (onHide) {
        onHide();
      }
      if (hide) {
        hide();
      }
    } else if (onShow) {
      onShow();
    }
    // setAnimation(false);
  };

  React.useEffect(() => {
    if (visible) {
      if (isAnimation) {
        setTimeout(() => {
          $_showPopupBox();
        }, 50);
      } else {
        $_showPopupBox();
      }
    } else {
      $_hidePopupBox();
    }
  }, [visible]);

  let defaultTransition = '';

  switch (position) {
    case 'bottom':
      defaultTransition = 'wm-slide-up';
      break;
    case 'top':
      defaultTransition = 'wm-slide-down';
      break;
    case 'left':
      defaultTransition = 'wm-slide-right';
      break;
    case 'right':
      defaultTransition = 'wm-slide-left';
      break;
    default:
      defaultTransition = 'wm-fade';
  }

  if (!isPopupShow) {
    return null;
  }

  return (
    <div
      className={classnames('wm-popup', className, position, {
        'with-mask': hasMask,
        'large-radius': largeRadius,
      })}
      ref={popupRef}
    >
      <CSSTransition
        in={hasMask && isPopupBoxShow}
        timeout={250}
        classNames="wm-mask-fade"
        unmountOnExit
        appear
      >
        <div className="wm-popup-mask" onClick={$_onPopupMaskClick} />
      </CSSTransition>
      <Transition
        name={transition || defaultTransition}
        visible={isPopupBoxShow}
        onEnter={$_onPopupTransitionStart}
        onExit={$_onPopupTransitionStart}
        onEntered={$_onPopupTransitionEnd}
        onExited={$_onPopupTransitionEnd}
        timeout={250}
        appear
      >
        <div className={classnames('wm-popup-box', transition || defaultTransition)}>
          {children}
        </div>
      </Transition>
    </div>
  );
};

Popup.defaultProps = {
  visible: false,
  hasMask: true,
  maskClosable: true,
  position: 'center',
  transition: '',
  preventScroll: false,
  largeRadius: false,
  preventScrollExclude: '',
};

export default Popup;
