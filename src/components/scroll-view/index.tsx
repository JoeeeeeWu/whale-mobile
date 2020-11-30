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

interface ScrollViewState {
  scroller: any;
  refreshOffsetY: number;
  isInitialed: boolean;
  isMouseDown: boolean;
  isRefreshing: boolean;
  isRefreshActive: boolean;
  isEndReachingStart: boolean;
  isEndReaching: boolean;
  scrollX: number;
  scrollY: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  containerW: number;
  containerH: number;
  contentW: number;
  contentH: number;
  reflowTimer: any;
  endReachedHandler: any;
  moreOffsetY: number;
}

class ScrollView extends React.Component<ScrollViewProps, ScrollViewState> {
  private containerRef = React.createRef<HTMLDivElement>();

  state = {
    scroller: null,
    refreshOffsetY: 0,
    isInitialed: false,
    isMouseDown: false,
    isRefreshing: false,
    isRefreshActive: false,
    isEndReachingStart: false,
    isEndReaching: false,
    scrollX: 0,
    scrollY: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    containerW: 0,
    containerH: 0,
    contentW: 0,
    contentH: 0,
    reflowTimer: null,
    endReachedHandler: null,
    moreOffsetY: 0,
  };

  $_getScrollerAngle = () => {
    const { currentX, currentY, startX, startY } = this.state;
    const { scrollingX } = this.props;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const angle = (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
    return scrollingX ? 90 - angle : angle;
  };

  $_onScrollerTouchStart = (event) => {
    const { scroller } = this.state;
    if (!scroller) {
      return;
    }
    this.setState({
      startX: event.targetTouches[0].pageX,
      startY: event.targetTouches[0].pageY,
    });
    scroller?.doTouchStart(event.touches, event.timeStamp);
  };

  $_onScrollerTouchMove = (event) => {
    const { scroller } = this.state;
    const { isPrevent = true } = this.props;
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

    this.setState({
      currentX: currentPageX,
      currentY: currentPageY,
    });

    const { scrollingX = true, scrollingY = true, touchAngle = 45 } = this.props;

    if (!scrollingX || !scrollingY) {
      const currentTouchAngle = this.$_getScrollerAngle();
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

  $_onScrollerTouchEnd = (event) => {
    const { scroller } = this.state;
    if (!scroller) {
      return;
    }
    scroller.doTouchEnd(event.timeStamp);
  };
  $_onScrollerMouseDown = () => {};
  $_onScrollerMouseMove = () => {};
  $_onScrollerMouseUp = () => {};

  reflowScroller = (force = false) => {
    const { scroller, containerW, containerH, contentW, contentH } = this.state;
    const container = this.containerRef.current;
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
      this.setState({
        containerW: currentContainerW,
        containerH: currentContainerH,
        contentW: currentContentW,
        contentH: currentContentH,
      });
    }
    // })
  };

  $_destroyAutoReflow = () => {
    const { reflowTimer } = this.state;
    if (reflowTimer) {
      clearInterval(reflowTimer);
    }
  };

  $_initAutoReflow = () => {
    this.$_destroyAutoReflow();
    const reflowTimer = setInterval(() => {
      this.reflowScroller();
    }, 100);
    this.setState({
      reflowTimer,
    });
  };

  $_checkScrollerEnd = () => {
    const { scroller, moreOffsetY, isEndReaching, endReachedHandler } = this.state;
    const { endReachedThreshold = 0 } = this.props;
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
      this.setState({
        isEndReachingStart: true,
      });
      // Second enter "load more" state
      // & trigger endReached event only once after the rebounding animation
      endReachedHandler();
    }
  };

  $_onScroll = (left, top) => {
    const { onScroll = () => {} } = this.props;
    left = +left.toFixed(2);
    top = +top.toFixed(2);
    const { scrollX, scrollY } = this.state;
    if (scrollX === left && scrollY === top) {
      return;
    }
    this.setState({
      scrollX: left,
      scrollY: top,
    });
    this.$_checkScrollerEnd();
    onScroll({ scrollLeft: left, scrollTop: top });
  };

  $_initScroller = () => {
    const { isInitialed, refreshOffsetY } = this.state;
    const {
      scrollingX = true,
      scrollingY = true,
      bouncing = true,
      immediateCheckEndReaching = false,
      onRefreshing = () => {},
      onRefreshActive = () => {},
      autoReflow = false,
      onEndReached = () => {},
      refresh,
    } = this.props;
    if (isInitialed) {
      return;
    }
    const container = this.containerRef?.current;
    const refresher = container?.querySelector('.scroll-view-refresh');
    const more = container?.querySelector('.scroll-view-more');
    const content = container?.querySelector('.scroll-view-container');
    this.setState({
      refreshOffsetY: refresher ? refresher.clientHeight : 0,
      moreOffsetY: more ? more.clientHeight : 0,
    });
    const rect = container?.getBoundingClientRect();
    const scroller = new Scroller(
      (left, top) => {
        render(content, left, top);
        if (this.state.isInitialed) {
          this.$_onScroll(left, top);
        }
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
        refresher ? refresher.clientHeight : 0,
        () => {
          this.setState({
            isRefreshActive: true,
            isRefreshing: false,
          });
          onRefreshActive();
        },
        () => {
          this.setState({
            isRefreshActive: false,
            isRefreshing: false,
          });
        },
        () => {
          this.setState({
            isRefreshActive: false,
            isRefreshing: true,
          });
          onRefreshing();
        },
      );
    }
    this.setState(
      {
        scroller,
      },
      () => {
        this.reflowScroller(true);
      },
    );

    if (autoReflow) {
      this.$_initAutoReflow();
    }
    this.setState({
      endReachedHandler: debounce(() => {
        this.setState({
          isEndReaching: true,
        });
        onEndReached();
      }, 50),
    });

    setTimeout(() => {
      this.setState({
        isInitialed: true,
      });
    }, 50);

    if (immediateCheckEndReaching) {
      // this.$nextTick(this.$_checkScrollerEnd)
      this.$_checkScrollerEnd();
    }
  };

  finishRefresh = () => {
    const { scroller } = this.state;
    /* istanbul ignore if */
    if (!scroller) {
      return;
    }
    scroller.finishPullToRefresh();
    this.reflowScroller();
  };

  finishLoadMore = () => {
    const { scroller } = this.state;
    if (!scroller) {
      return;
    }
    this.setState({
      isEndReachingStart: false,
      isEndReaching: false,
    });
    this.reflowScroller();
  };

  componentDidMount() {
    const { manualInit = false } = this.props;
    if (!manualInit) {
      this.$_initScroller();
    }
  }

  render() {
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
    } = this.props;
    const {
      scrollY,
      isRefreshing,
      isRefreshActive,
      isEndReachingStart,
      isEndReaching,
    } = this.state;
    const refreshNode = refresh
      ? React.cloneElement(refresh, {
          scrollTop: scrollY,
          isRefreshing,
          isRefreshActive,
        })
      : null;
    const moreNode = more
      ? React.cloneElement(more, {
          isEndReaching: isEndReachingStart || isEndReaching,
        })
      : null;
    return (
      <div
        ref={this.containerRef}
        className="wm-scroll-view"
        onTouchStart={this.$_onScrollerTouchStart}
        onTouchMove={this.$_onScrollerTouchMove}
        onTouchEnd={this.$_onScrollerTouchEnd}
        onTouchCancel={this.$_onScrollerTouchEnd}
        onMouseDown={this.$_onScrollerMouseDown}
        onMouseMove={this.$_onScrollerMouseMove}
        onMouseUp={this.$_onScrollerMouseUp}
        onMouseLeave={this.$_onScrollerMouseUp}
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
  }
}

export default ScrollView;
