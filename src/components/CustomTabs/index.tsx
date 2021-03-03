import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { TabView } from 'react-native-tab-view';
import { useMount, lockToPortrait } from 'utils';
import analytics from '@react-native-firebase/analytics';
import { default as appTheme } from 'utils/theme';
import { ParamListBase } from '@react-navigation/native';
import { hasOwnProperty } from 'actions/utils';

import TabBarStyled from './TabBarStyled';

type TabsProps = {
  tabs: {
    key: string;
    title: string;
    testID?: string;
    component: React.ComponentType;
    params?: ParamListBase;
  }[];
  selectedIndex: number;
  theme?: string;
};

interface ScenesType {
  [key: string]:
    | {
        params: ParamListBase;
        component: ReactElement;
      }
    | {};
}

interface RenderSceneParams {
  route: {
    key: string;
    title: string;
    testID?: string | undefined;
    component: React.ComponentType;
    params?: Record<string, object | undefined> | undefined;
  };
}

/**
 * Custom Tabs
 * @param tabs array of objects {key, title, testID, component}
 */
const CustomTabs = ({
  tabs,
  selectedIndex = 0,
  theme = '',
  ...rest
}: TabsProps): React.ReactElement => {
  const [index, setIndex] = useState(selectedIndex);
  const [routes] = useState(tabs);
  const scenes = useRef<ScenesType>({});
  // const scenes = useRef({});

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
  }, [tabs, tabs.length]);

  // On active tab index change - report event to analytics.
  useEffect(() => {
    // Google Analytics: Record screen change.
    // https://rnfirebase.io/analytics/screen-tracking#react-navigation
    analytics().logScreenView({
      screen_name: tabs[index]?.title,
      screen_class: 'CustomTabs',
    });
  }, [index, tabs]);

  const renderScene = ({ route }: RenderSceneParams): ReactElement => {
    if (!Object.keys(scenes.current).length) {
      return <></>;
    }

    // TODO: Try resolving the next TS warning:
    // Property 'component' does not exist on type '{} | { params:...
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
