import React from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import Transition from '../transition';
import './index.less';

interface PopupProps {
  visible?: boolean;
  hasMask?: boolean;
  maskClosable?: boolean;
  position?: string;
  transition?: string;
  preventScroll?: boolean;
  preventScrollExclude?: string | Function;
  largeRadius?: boolean;
  beforeHide?: Function;
  beforeShow?: Function;
  hide?: Function;
  show?: Function;
  onHide?: Function;
}

const Popup: React.FC<PopupProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPopupShow, setPopupShow] = React.useState<boolean>(false);
  const [isPopupBoxShow, setPopupBoxShow] = React.useState<boolean>(false);
  const [isAnimation, setAnimation] = React.useState<boolean>(false);
  const popupMaskRef = React.useRef(null);
  const popupBoxRef = React.useRef(null);
  const popupRef = React.useRef(null);
  const {
    visible,
    preventScroll,
    preventScrollExclude,
    position,
    hasMask,
    largeRadius,
    transition,
    beforeHide,
    beforeShow,
    hide,
    show,
    onHide,
    maskClosable,
    children,
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
    const excluder = exclude && typeof exclude === 'string' ? 'ddd' : exclude;
    if (excluder) {
      excluder[handler]('touchmove', $_stopImmediatePropagation, false);
    }
  };
  const $_preventScroll = (isBind: boolean) => {
    const handler = isBind ? 'addEventListener' : 'removeEventListener';
    if (popupMaskRef) {
      popupMaskRef[handler]('touchmove', $_preventDefault, false);
    }
    if (popupBoxRef) {
      popupBoxRef[handler]('touchmove', $_preventDefault, false);
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
    if (onHide) {
      onHide();
    }
  };
  const $_onPopupMaskClick = () => {
    if (maskClosable) {
      $_hidePopupBox();
      // this.$emit('maskClick')
    }
  };
  const $_onPopupTransitionStart = () => {
    if (!isPopupBoxShow) {
      if (beforeHide) {
        beforeHide();
      }
    } else if (beforeShow) {
      beforeShow();
    }
  };

  const $_onPopupTransitionEnd = () => {
    if (!isAnimation) {
      return;
    }
    if (!isPopupBoxShow) {
      // popup hide after popup box finish animation
      setPopupShow(false);
      if (hide) {
        hide();
      }
    } else if (show) {
      show();
    }
    // setAnimation(false);
  };

  // React.useEffect(() => {
  //   if (visible) {
  //     $_showPopupBox();
  //   }
  // }, []);

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(visible);
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

  if (!isPopupShow) {
    return null;
  }

  let defaultTransition = '';

  switch (position) {
    case 'botton':
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

  return (
    <div
      className={classnames('wm-popup', position, {
        'with-mask': hasMask,
        'large-radius': largeRadius,
      })}
      ref={popupRef}
      style={{ display: isPopupShow ? 'flex' : 'none' }}
    >
      <CSSTransition
        in={hasMask && isPopupBoxShow}
        timeout={250}
        classNames="wm-mask-fade"
        unmountOnExit
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
        timeout={300}
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
  transition: 'wm-fade',
  preventScroll: false,
  largeRadius: false,
  preventScrollExclude: () => '',
};

export default Popup;
