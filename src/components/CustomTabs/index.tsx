import React, { useState, useEffect, useRef } from 'react';
import { TabView } from 'react-native-tab-view';
import { useMount, lockToPortrait } from 'utils';
import analytics from '@react-native-firebase/analytics';
import { default as appTheme } from 'utils/theme';

import TabBarStyled from './TabBarStyled';

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
const CustomTabs = ({
  tabs,
  selectedIndex = 0,
  theme,
  ...rest
}: TabsProps): React.ReactElement => {
  const [index, setIndex] = useState(selectedIndex);
  const [routes] = useState(tabs);
  const scenes = useRef({});

  useEffect(() => {
    setIndex(selectedIndex);
  }, [selectedIndex]);

  useMount(() => {
    lockToPortrait();
  });

  useEffect(() => {
    tabs.forEach(tab => {
      scenes.current[tab.key] = {
        component: tab.component,
        params: tab.params || {},
      };
    });
  }, [tabs.length]);

  // On active tab index change - report event to analytics.
  useEffect(() => {
    // Google Analytics: Record screen change.
    // https://rnfirebase.io/analytics/screen-tracking#react-navigation
    analytics().logScreenView({
      screen_name: tabs[index]?.title,
      screen_class: 'CustomTabs',
    });
  }, [index]);

  const renderScene = ({ route, jumpTo }) => {
    if (!Object.keys(scenes.current).length) {
      return <></>;
    }

    return React.createElement(
      scenes.current[route.key].component,
      scenes.current[route.key]?.params,
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props): React.ReactElement => (
        <TabBarStyled {...props} theme={theme} />
      )}
      style={{
        backgroundColor: appTheme.colors.primary,
        flex: 1,
      }}
      // initialLayout={{ width: st.fullWidth }}
      {...rest}
    />
  );
};

export default CustomTabs;
