import React from 'react';
import Popup from '../../components/popup';
import Button from '../../components/button';
import styles from './index.module.less';

const PopupPage: React.FC = () => {
  const [isCenterPopupShow, setCenterPopupShow] = React.useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log('hehe');
          setCenterPopupShow(true);
        }}
      >
        屏幕中弹出
      </Button>
      <Popup visible={isCenterPopupShow} position="center" onHide={() => setCenterPopupShow(false)}>
        <div className={styles.center}>屏幕中弹出</div>
      </Popup>
    </div>
  );
};

export default PopupPage;
