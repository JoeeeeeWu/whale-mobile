/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import { debounce } from '../util';
import Scroller from '../util/scroller';
import { render } from '../util/render';
import './index.less';
interface ScrollViewProps {
  scrollingX?: boolean;
  scrollingY?: boolean;
  bouncing?: boolean;
  autoReflow?: boolean;
  manualInit?: boolean;
  endReachedThreshold?: number;
  immediateCheckEndReaching?: boolean;
  touchAngle?: number;
  isPrevent?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  refresh?: ReactElement;
  more?: ReactElement;
  onRefreshActive?: Function;
  onRefreshing?: Function;
  onEndReached?: Function;
  onScroll?: Function;
}

const ScrollView: React.FC<ScrollViewProps> = (props) => {
  const containerRef = React.useRef(null);

  const [test, setTest] = React.useState([1]);
  const [refresher] = React.useState(null);
  const [moreRef] = React.useState(null);
  const [scroller, setScroller] = React.useState(null);
  const [refreshOffsetY, setRefreshOffsetY] = React.useState(0);
  const [isInitialed, setInitialed] = React.useState(false);
  const [isMouseDown] = React.useState(false);
  const [isRefreshing, setRefreshing] = React.useState(false);
  const [isRefreshActive, setRefreshActive] = React.useState(false);
  const [isEndReachingStart, setEndReachingStart] = React.useState(false);
  const [isEndReaching, setEndReaching] = React.useState(false);
  const [scrollX, setScrollX] = React.useState(null);
  const [scrollY, setScrollY] = React.useState(null);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [currentX, setCurrentX] = React.useState(0);
  const [currentY, setCurrentY] = React.useState(0);
  const [containerW, setContainerW] = React.useState(0);
  const [containerH, setContainerH] = React.useState(0);
  const [contentW, setContentW] = React.useState(0);
  const [contentH, setContentH] = React.useState(0);
  const [reflowTimer, setReflowTimer] = React.useState(null);
  const [endReachedHandler, setEndReachedHandler] = React.useState(null);
  const [moreOffsetY, setMoreOffsetY] = React.useState(0);
  const {
    scrollingX = true,
    scrollingY = true,
    bouncing = true,
    autoReflow = false,
    manualInit = false,
    endReachedThreshold = 0,
    immediateCheckEndReaching = false,
    touchAngle = 45,
    isPrevent = true,
    children,
    header,
    footer,
    refresh,
    more,
    onRefreshActive = () => {},
    onRefreshing = () => {},
    onEndReached = () => {},
    onScroll = () => {},
  } = props;

  const $_getScrollerAngle = () => {
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const angle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
    return scrollingX ? 90 - angle : angle;
  };

  const $_onScrollerTouchStart = (event) => {
    if (!scroller) {
      return;
    }
    setStartX(event.targetTouches[0].pageX);
    setStartY(event.targetTouches[0].pageY);
    scroller.doTouchStart(event.touches, event.timeStamp);
  };

  const $_onScrollerTouchMove = (event) => {
    if (!scroller) {
      return;
    }
    let hadPrevent = false;

    if (isPrevent) {
      event.preventDefault();

      hadPrevent = true;
    }

    const currentPageX = event.targetTouches[0].pageX;
    const currentPageY = event.targetTouches[0].pageY;

    setCurrentX(currentPageX);
    setCurrentY(currentPageY);

    if (!scrollingX || !scrollingY) {
      const currentTouchAngle = $_getScrollerAngle();
      if (currentTouchAngle < touchAngle) {
        return;
      }
    }

    if (!hadPrevent && event.cancelable) {
      event.preventDefault();
    }

    scroller.doTouchMove(event.touches, event.timeStamp, event.scale);

    const boundaryDistance = 15;
    const scrollLeft =
      document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
    const scrollTop =
      document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

    const pX = currentPageX - scrollLeft;
    const pY = currentPageY - scrollTop;
    if (
      pX > document.documentElement.clientWidth - boundaryDistance ||
      pY > document.documentElement.clientHeight - boundaryDistance ||
      pX < boundaryDistance ||
      pY < boundaryDistance
    ) {
      scroller.doTouchEnd(event.timeStamp);
    }
  };

  const $_onScrollerTouchEnd = (event) => {
    if (!scroller) {
      return;
    }
    scroller.doTouchEnd(event.timeStamp);
  };
  const $_onScrollerMouseDown = () => {};
  const $_onScrollerMouseMove = () => {};
  const $_onScrollerMouseUp = () => {};

  const refreshNode = refresh
    ? React.cloneElement(refresh, {
        scrollTop: scrollY,
        isRefreshing: isRefreshing,
        isRefreshActive: isRefreshActive,
      })
    : null;
  const moreNode = more
    ? React.cloneElement(more, {
        isEndReaching: isEndReachingStart || isEndReaching,
      })
    : null;

  const reflowScroller = (force = false) => {
    const container = containerRef.current;
    const content = container?.querySelector('.scroll-view-container');
    /* istanbul ignore if */
    if (!scroller || !container || !content) {
      return;
    }
    // this.$nextTick(() => {
    const currentContainerW = container.clientWidth;
    const currentContainerH = container.clientHeight;
    const currentContentW = content.offsetWidth;
    const currentContentH = content.offsetHeight;

    if (
      force ||
      containerW !== currentContainerW ||
      containerH !== currentContainerH ||
      contentW !== currentContentW ||
      contentH !== currentContentH
    ) {
      scroller.setDimensions(
        container.clientWidth,
        container.clientHeight,
        content.offsetWidth,
        content.offsetHeight,
      );
      setContainerW(containerW);
      setContainerH(containerH);
      setContentW(contentW);
      setContentH(contentH);
    }
    // })
  };

  const $_destroyAutoReflow = () => {
    if (reflowTimer) {
      clearInterval(reflowTimer);
    }
  };

  const $_initAutoReflow = () => {
    $_destroyAutoReflow();
    const reflowTimer = setInterval(() => {
      reflowScroller();
    }, 100);
    setReflowTimer(reflowTimer);
  };

  const $_checkScrollerEnd = () => {
    if (!scroller) {
      return;
    }
    const containerHeight = scroller._clientHeight;
    const content = scroller._contentHeight;
    const top = scroller._scrollTop;
    const moreThreshold = endReachedThreshold;
    const endOffset = content - containerHeight - (top + moreOffsetY + moreThreshold);
    if (top >= 0 && !isEndReaching && endOffset <= 0 && endReachedHandler) {
      // First prepare for "load more" state
      setEndReachingStart(true);
      // Second enter "load more" state
      // & trigger endReached event only once after the rebounding animation
      endReachedHandler();
    }
  };

  const $_onScroll = (left, top) => {
    left = +left.toFixed(2);
    top = +top.toFixed(2);
    if (scrollX === left && scrollY === top) {
      return;
    }
    setScrollX(left);
    setScrollY(top);
    $_checkScrollerEnd();
    onScroll({ scrollLeft: left, scrollTop: top });
  };

  const $_initScroller = () => {
    if (isInitialed) {
      return;
    }
    const container = containerRef?.current;
    const refresher = container?.querySelector('.scroll-view-refresh');
    const more = container?.querySelector('.scroll-view-more');
    const content = container?.querySelector('.scroll-view-container');
    setRefreshOffsetY(refresher ? refresher.clientHeight : 0);
    setMoreOffsetY(more ? more.clientHeight : 0);
    const rect = container?.getBoundingClientRect();
    const scroller = new Scroller(
      (left, top) => {
        render(content, left, top);
        // if (isInitialed) {
        $_onScroll(left, top);
        // }
      },
      {
        scrollingX,
        scrollingY,
        bouncing,
        zooming: false,
        animationDuration: 200,
        speedMultiplier: 1.2,
        inRequestAnimationFrame: true,
      },
    );
    scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);
    if (refresh) {
      scroller.activatePullToRefresh(
        refreshOffsetY,
        () => {
          setRefreshActive(true);
          setRefreshing(false);
          onRefreshActive();
        },
        () => {
          setRefreshActive(false);
          setRefreshing(false);
        },
        () => {
          setRefreshActive(false);
          setRefreshing(true);
          onRefreshing();
        },
      );
    }
    setScroller(scroller);
    reflowScroller(true);

    if (autoReflow) {
      $_initAutoReflow();
    }
    setEndReachedHandler(
      debounce(() => {
        setEndReaching(true);
        onEndReached();
      }, 50),
    );

    setTimeout(() => {
      setInitialed(true);
    }, 50);

    if (immediateCheckEndReaching) {
      // this.$nextTick(this.$_checkScrollerEnd)
      $_checkScrollerEnd();
    }
  };

  React.useEffect(() => {
    if (!manualInit) {
      $_initScroller();
    }
    setTest((pre) => {
      pre.push(2);
      return [...pre];
    });
  }, []);

  React.useEffect(() => {
    reflowScroller();
  }, [scroller]);

  return (
    <div
      ref={containerRef}
      className="wm-scroll-view"
      onTouchStart={$_onScrollerTouchStart}
      onTouchMove={$_onScrollerTouchMove}
      onTouchEnd={$_onScrollerTouchEnd}
      onTouchCancel={$_onScrollerTouchEnd}
      onMouseDown={$_onScrollerMouseDown}
      onMouseMove={$_onScrollerMouseMove}
      onMouseUp={$_onScrollerMouseUp}
      onMouseLeave={$_onScrollerMouseUp}
    >
      {header ? <div className="scroll-view-header">{header}</div> : null}
      <div
        className={classnames('scroll-view-container', {
          horizon: scrollingX && !scrollingY,
        })}
      >
        {refresh ? (
          <div
            className={classnames('scroll-view-refresh', {
              refreshing: isRefreshing,
              'refresh-active': isRefreshActive,
            })}
          >
            {refreshNode}
          </div>
        ) : null}
        {children}
        {more ? (
          <div
            className={classnames('scroll-view-more', {
              active: isEndReachingStart || isEndReaching,
            })}
          >
            {moreNode}
          </div>
        ) : null}
      </div>
      {footer ? <div className="scroll-view-footer">{footer}</div> : null}
    </div>
  );
};

export default ScrollView;
