import React, { useState } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import TabBarStyled from './TabBarStyled';
import { useMount, lockToPortrait } from '../../utils';

type TabsProps = {
  tabs: {
    key: string;
    title: string;
    testID?: string;
    component: React.ComponentType;
  }[];
  initial: number;
};

/**
 * Custom Tabs
 * @param tabs array of objects {key, title, testID, component}
 */
const CustomTabs = ({ tabs, initial }: TabsProps): React.ReactElement => {
  const [index, setIndex] = React.useState(initial||0);
  const [routes] = useState(tabs);
  const scenes: { [key: string]: React.ComponentType } = {};

  useMount(() => {
    lockToPortrait();
  });

  tabs.forEach(tab => {
    scenes[tab.key] = tab.component;
  });

  const renderScene = SceneMap(scenes);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props): React.ReactElement => <TabBarStyled {...props} />}
      // initialLayout={{ width: st.fullWidth }}
    />
  );
};

export default CustomTabs;
