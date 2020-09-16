import React, { useState, useEffect } from 'react';
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
  theme: string;
};

/**
 * Custom Tabs
 * @param tabs array of objects {key, title, testID, component}
 */
const CustomTabs = ({ tabs, selectedIndex = 0, theme }: TabsProps): React.ReactElement => {
  const [index, setIndex] = useState(selectedIndex);
  const [routes] = useState(tabs);
  const scenes: { [key: string]: React.ComponentType } = {};

  useEffect(() => {
    setIndex(selectedIndex);
  }, [selectedIndex])

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
      renderTabBar={(props): React.ReactElement => <TabBarStyled {...props} theme={theme} />}
      // initialLayout={{ width: st.fullWidth }}
    />
  );
};

export default CustomTabs;
