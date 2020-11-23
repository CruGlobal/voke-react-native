import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import st from 'utils/st';
import theme from 'utils/theme';

import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';

import styles from './styles';

function tabElement(index, label, isFocused) {
  let iconName = 'adventure';
  if (index === 1) {
    iconName = 'compass';
  }
  if (index === 2) {
    iconName = 'notifications';
  }

  const unReadBadgeCount = useSelector(({ data }) =>
    iconName === 'adventure'
      ? data.unReadBadgeCount
      : iconName === 'notifications'
      ? data.notificationUnreadBadge
      : null,
  );

  return (
    <Flex
      direction="column"
      align="center"
      style={styles.container}
      justify="between"
    >
      <VokeIcon
        name={iconName}
        size={24}
        style={isFocused ? styles.iconFocused : styles.icon}
      />
      <Text style={isFocused ? styles.labelFocused : styles.label}>
        {label}
      </Text>
      {unReadBadgeCount > 0 ? (
        <Flex style={styles.badge}>
          <Text style={styles.badgeCount}>
            {unReadBadgeCount > 99 ? '99' : unReadBadgeCount}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
}

function TabBar({ state, descriptors, navigation }) {
  return (
    <>
      <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.wrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Touchable
              key={`${label}${index}`}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => {
                onPress();
              }}
              style={{ flex: 1 }}
            >
              {tabElement(index, label, isFocused)}
            </Touchable>
          );
        })}
      </SafeAreaView>
    </>
  );
}

export default TabBar;
