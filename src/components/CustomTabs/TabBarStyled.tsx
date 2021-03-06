import React from 'react';
import { TabBar } from 'react-native-tab-view';
import theme from 'utils/theme';
import Text from 'components/Text';

import styles from './styles';

// props.theme
const TabBarStyled = (props: any): React.ReactElement => {
  const tabsTheme = props.theme || '';
  return (
    <TabBar
      indicatorStyle={styles['indicatorStyle' + tabsTheme]}
      style={styles['tabBar' + tabsTheme]}
      // activeColor={theme.colors.secondary}
      // inactiveColor={theme.colors.secondary}
      // Param renderLabel can have the next params: ({ route, focused, color }).
      renderLabel={({ route, focused }): React.ReactElement => (
        <Text
          style={styles['tabBarTitle' + tabsTheme + (focused ? 'Active' : '')]}
        >
          {route.title}
        </Text>
      )}
      {...props}
    />
  );
};

export default TabBarStyled;
