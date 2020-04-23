import React from 'react';
import { TabBar } from 'react-native-tab-view';
import Text from '../Text';

import styles from './styles';

const TabBarStyled = (props: any): React.ReactElement => (
  <TabBar
    indicatorStyle={{ backgroundColor: styles.colors.white }}
    style={{ backgroundColor: styles.colors.secondary }}
    activeColor={styles.colors.white}
    inactiveColor={styles.colors.primary}
    // Param renderLabel can have the next params: ({ route, focused, color }).
    renderLabel={({ route }): React.ReactElement => (
      <Text style={styles.TabBarTitle}>{route.title}</Text>
    )}
    {...props}
  />
);

export default TabBarStyled;
