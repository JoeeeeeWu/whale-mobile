/* eslint-disable */

import React, { ReactNode } from 'react';
import classnames from 'classnames';

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
  refresh?: ReactNode;
  more?: ReactNode;
}

const ScrollView: React.FC<ScrollViewProps> = (props) => {
  const [container] = React.useState();
  const [content] = React.useState();
  const [refresher] = React.useState();
  const [isRefreshActive] = React.useState();
  const [isEndReachingStart] = React.useState();
  const [moreNode] = React.useState();
  const [scroller] = React.useState();
  const [refreshOffsetY] = React.useState();
  const [isInitialed] = React.useState();
  const [isMouseDown] = React.useState();
  const [isRefreshing] = React.useState();
  const [isRefreshActive] = React.useState();
  const [isEndReachingStart] = React.useState();
  const [isEndReaching] = React.useState();
  const [scrollX] = React.useState();
  const [scrollY] = React.useState();
  const [startX] = React.useState();
  const [startY] = React.useState();
  const [currentX] = React.useState();
  const [currentY] = React.useState();
  const [containerW] = React.useState();
  const [containerH] = React.useState();
  const [contentW] = React.useState();
  const [contentH] = React.useState();
  const [reflowTimer] = React.useState();
  const [endReachedHandler] = React.useState();
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
  } = props;
  const $_onScrollerTouchStart = () => {};
  const $_onScrollerTouchMove = () => {};
  const $_onScrollerTouchEnd = () => {};
  const $_onScrollerMouseDown = () => {};
  const $_onScrollerMouseMove = () => {};
  const $_onScrollerMouseUp = () => {};
  return (
    <div
      className="md-scroll-view"
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
            {/* todo */}
            {/* <slot
              name="refresh"
              :scroll-top="scrollY"
              :is-refreshing="isRefreshing"
              :is-refresh-active="isRefreshActive"
            ></slot> */}
          </div>
        ) : null}
        {children}
        {more ? (
          <div
            className={classnames('scroll-view-more', {
              active: isEndReachingStart || isEndReaching,
            })}
          >
            {/* <slot name="more" :is-end-reaching="isEndReachingStart || isEndReaching"></slot> */}
          </div>
        ) : null}
      </div>
      {footer ? <div className="scroll-view-footer">{footer}</div> : null}
    </div>
  );
};

export default ScrollView;
