import React from 'react';
import './index.less';

interface ScrollViewMoreProps {
  loadingText?: string;
  finishedText?: string;
  isFinished?: boolean;
}

const ScrollViewMore: React.FC<ScrollViewMoreProps> = (props) => {
  const { loadingText = '更多加载中...', finishedText = '全部已加载', isFinished = false } = props;
  return <div className="wm-scroll-view-more">{isFinished ? finishedText : loadingText}</div>;
};

export default ScrollViewMore;
