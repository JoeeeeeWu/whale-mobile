import React from 'react';
import ScrollView from '../../components/scroll-view';
import ScrollViewRefresh from '../../components/scroll-view-refresh';
import styles from './index.module.less';

const ScrollViewPage: React.FC = () => {
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
        <ScrollView refresh={<ScrollViewRefresh />}>
          {[...Array(20).keys()].map((i) => {
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
