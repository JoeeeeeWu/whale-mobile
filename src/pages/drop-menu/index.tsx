import React from 'react';
import DropMenu from '../../components/drop-menu';
import styles from './index.module.less';

const data = [
  {
    text: '一级选项1',
    options: [
      {
        value: '0',
        text: '二级选项1',
      },
      {
        value: '1',
        text: '二级选项2',
      },
    ],
  },
];

const DropMenuPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <DropMenu data={data} className={styles.dropMenu} />
      <div className={styles.content}>正文区域</div>
    </div>
  );
};

export default DropMenuPage;
