import React from 'react';
import Tabs from '../../components/tabs';
import TabPane from '../../components/tab-pane';

const TabsPage: React.FC = () => {
  return (
    <Tabs>
      <TabPane name="p1" label="第一章">
        她对他很满意。走吧。好。他起身买单，腿却一拐一拐的。难怪他才华横溢，事业有成，却还是单身。趁着他买单，她赶紧悄悄走了。
      </TabPane>
      <TabPane name="p2" label="第二章">
        又是一年，她又遇到了他，他正牵着孩子的手，走的飞快。
      </TabPane>
      <TabPane name="p3" label="第三章">
        你的腿？她有些诧异。腿？我的腿怎么了？他更诧异。后来，她才知道他的腿，那天只是坐麻了而已。
      </TabPane>
    </Tabs>
  );
};

export default TabsPage;
