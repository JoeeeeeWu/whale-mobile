import React from 'react';
import ActivityIndicatorRolling from '../activity-indicator/roller';
import './index.less';

interface ScrollViewRefreshProps {
  scrollTop?: number;
  isRefreshing?: boolean;
  isRefreshActive?: boolean;
  refreshText?: string;
  refreshActiveText?: string;
  refreshingText?: string;
  rollerColor?: string;
}

const ScrollViewRefresh: React.FC<ScrollViewRefreshProps> = (props) => {
  const refreshRef = React.useRef(null);
  const {
    scrollTop = 0,
    isRefreshing = false,
    isRefreshActive = false,
    refreshText = '下拉刷新',
    refreshActiveText = '释放刷新',
    refreshingText = '刷新中...',
    rollerColor = '#2F86F6',
  } = props;
  const getProcess = () => {
    if (!refreshRef || !scrollTop) {
      return +scrollTop;
    }

    const refreshHeight = refreshRef?.current?.clientHeight;

    if (Math.abs(scrollTop) < refreshHeight / 2) {
      return 0;
    }
    // eslint-disable-next-line no-console
    // console.log(scrollTop, refreshHeight);
    // first 1/3 is not included in progress
    return (Math.abs(scrollTop) - refreshHeight / 2) / (refreshHeight / 2);
  };
  const process = getProcess();
  // eslint-disable-next-line no-console
  // console.log(process);
  const getRefreshTip = () => {
    if (isRefreshing) {
      return refreshingText;
    }
    if (isRefreshActive) {
      return refreshActiveText;
    }
    return refreshText;
  };
  const refreshTip = getRefreshTip();
  return (
    <div className="wm-scroll-view-refresh" ref={refreshRef}>
      <ActivityIndicatorRolling
        process={!isRefreshing ? process : undefined}
        width={10}
        color={rollerColor}
      />
      <p className="refresh-tip">{refreshTip}</p>
    </div>
  );
};

export default ScrollViewRefresh;
