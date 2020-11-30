import React from 'react';
import ScrollView from '../../components/scroll-view';
import ScrollViewRefresh from '../../components/scroll-view-refresh';
import ScrollViewMore from '../../components/scroll-view-more';
import styles from './index.module.less';

const ScrollViewPage: React.FC = () => {
  const scrollRef = React.useRef(null);
  const [count, setCount] = React.useState<number>(20);
  const [isFinished, setIsFinished] = React.useState<boolean>(true);
  const onRefreshing = () => {
    setTimeout(() => {
      setCount(() => {
        return 20;
      });
      scrollRef?.current?.finishRefresh?.();
    }, 5000);
  };
  const onEndReached = () => {
    if (!isFinished || count > 40) {
      return;
    }
    // eslint-disable-next-line no-console
    console.log(count);
    setIsFinished(false);
    setTimeout(() => {
      setCount((preCount) => {
        const newCount = preCount + 5;
        return newCount;
      });
      setIsFinished(true);
      scrollRef?.current?.finishLoadMore?.();
    }, 5000);
  };
  return (
    <>
      <div className={styles.container}>
        <ScrollView>
          {[...Array(20).keys()].map((i) => {
            return (
              <div key={i} className={styles.scrollViewItem}>
                {i}
              </div>
            );
          })}
        </ScrollView>
      </div>
      <div className={styles.container}>
        <ScrollView
          ref={scrollRef}
          refresh={<ScrollViewRefresh />}
          more={<ScrollViewMore isFinished={isFinished} />}
          scrollingX={false}
          onRefreshing={onRefreshing}
          onEndReached={() => onEndReached()}
        >
          {[...Array(count).keys()].map((i) => {
            return (
              <div key={i} className={styles.scrollViewItem}>
                {i}
              </div>
            );
          })}
        </ScrollView>
      </div>
    </>
  );
};

export default ScrollViewPage;
