import React from 'react';
import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import { useSafeArea } from 'react-native-safe-area-context';
import st from '../../st';
import theme from '../../theme';

function getContent(label, isFocused) {
  let iconName = 'adventure';
  if (label === 'Videos') {
    iconName = 'video';
  }
  if (label === 'Notifications') {
    return (
      <Flex
        direction="column"
        align="center"
        style={[st.h(60)]}
        justify="between"
      >
        <VokeIcon
          name={isFocused ? 'notificationBell' : 'notificationBellBlue'}
          type={'image'}
          style={[st.h(28), st.w(28), st.mt5]}
        />
        <Text style={[isFocused ? st.white : st.blue, st.fs14]}>{label}</Text>
      </Flex>
    );
  }
  return (
    <Flex
      direction="column"
      align="center"
      style={[st.h(60)]}
      justify="between"
    >
      <VokeIcon
        name={iconName}
        size={24}
        style={[
          {
            color: isFocused ? theme.colors.white : theme.colors.primary,
          },
          st.mt5,
        ]}
      />
      <Text style={[isFocused ? st.white : st.blue, st.fs14]}>{label}</Text>
    </Flex>
  );
}

function TabBar({ state, descriptors, navigation }) {
  const insets = useSafeArea();

  return (
    <>
      <Flex
        direction="row"
        align="center"
        justify="between"
        style={[st.ph2, { paddingBottom: insets.bottom, backgroundColor: theme.colors.secondary, }]}
      >
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

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Touchable
              key={`${label}${index}`}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {getContent(label, isFocused)}
            </Touchable>
          );
        })}
      </Flex>
    </>
  );
}

export default TabBar;
