import React from 'react';
import Popup from '../../components/popup';
import PopupTitleBar from '../../components/popup/title-bar';
import Button from '../../components/button';
import styles from './index.module.less';

const PopupPage: React.FC = () => {
  const [isCenterPopupShow, setCenterPopupShow] = React.useState(false);
  const [isBottomPopupShow, setBottomPopupShow] = React.useState(false);
  return (
    <div>
      <Button
        onClick={() => {
          setCenterPopupShow(true);
        }}
      >
        屏幕中弹出
      </Button>
      <Button
        onClick={() => {
          setBottomPopupShow(true);
        }}
      >
        底部弹出
      </Button>
      <Popup visible={isCenterPopupShow} position="center" onHide={() => setCenterPopupShow(false)}>
        <div className={styles.center}>屏幕中弹出</div>
      </Popup>
      <Popup
        largeRadius
        visible={isBottomPopupShow}
        position="bottom"
        onHide={() => setBottomPopupShow(false)}
      >
        <PopupTitleBar
          largeRadius
          title="Popup Title"
          describe="Popup Description"
          okText="ok"
          cancelText="cancel"
          // onlyClose
          // titleAlign="left"
          onConfirm={() => setBottomPopupShow(false)}
          onCancel={() => setBottomPopupShow(false)}
        />
        <div className={styles.bottom}>屏幕中弹出</div>
      </Popup>
    </div>
  );
};

export default PopupPage;
