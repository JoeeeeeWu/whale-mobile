import React from 'react';
import Button from '../../components/button';
import Dialog from '../../components/dialog';

interface DialogPageProps {}

const DialogPage: React.FC<DialogPageProps> = () => {
  const [basicOpen, setBasicOpen] = React.useState<boolean>(false);
  const [actOpen, setActOpen] = React.useState<boolean>(false);
  // const [succeedOpen, setSucceedOpen] = React.useState<boolean>(false);
  const succeedConfirm = () => {
    Dialog.succeed({
      title: '成功',
      content: '恭喜您成功完成操作',
      confirmText: '确定',
      // eslint-disable-next-line no-console
      onConfirm: () => console.log('[Dialog.succeed] confirm clicked'),
    });
  };
  return (
    <>
      <Button onClick={() => setBasicOpen(true)}>基本</Button>
      <Button onClick={() => setActOpen(true)}>多操作</Button>
      <Button onClick={succeedConfirm}>成功弹窗</Button>

      <Dialog
        title="窗口标题"
        closable
        visible={basicOpen}
        btns={[
          {
            text: '取消',
            handler: () => setBasicOpen(false),
          },
          {
            text: '确认操作',
            handler: () => setBasicOpen(false),
          },
        ]}
        onHide={() => setBasicOpen(false)}
      >
        人生的刺，就在这里，留恋着不肯快走的，偏是你所不留恋的东西。
      </Dialog>

      <Dialog
        title="窗口标题"
        closable={false}
        layout="column"
        visible={actOpen}
        btns={[
          {
            text: '操作一',
            type: 'danger',
            handler: () => setActOpen(false),
          },
          {
            text: '操作二',
            handler: () => setActOpen(false),
            disabled: true,
          },
          {
            text: '操作三',
            handler: () => setActOpen(false),
          },
        ]}
      >
        据说每个人需要一面镜子，可以常常自照，知道自己是个什么东西。不过，能自知的人根本不用照镜子；不自知的东西，照了镜子也没有用。
      </Dialog>
    </>
  );
};

export default DialogPage;
