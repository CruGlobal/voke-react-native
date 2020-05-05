import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import st from '../../st';
import theme from '../../theme';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { StyleSheet } from 'react-native';

function getContent(label, isFocused) {
  let iconName = 'tab-adventure';
  if (label === 'Videos') {
    iconName = 'tab-video';
  }
  if (label === 'Notifications') {
    iconName = 'tab-notification';
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
     {/* <View style={{
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  }}> */}
   
        {/* </View> */}
      <Flex
        direction="row"
        align="center"
        justify="between"
        style={[
          st.ph2,
          {
            paddingBottom: insets.bottom,
            // backgroundColor: theme.colors.secondary,
            // backgroundColor: "rgba(0,0,0,.4)",
            position: "absolute",
            width: "100%",
            bottom: 0,

            // Hairline border
            // borderTopColor: "rgba(90, 205, 225, .4)",
            //  borderTopColor: "rgba(0,0,0, .5)",
            // borderTopWidth: StyleSheet.hairlineWidth,
          },
        ]}
      >
         <BlurView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
          // viewRef={this.state.viewRef}
          blurType="dark"
          blurAmount={10}
          reducedTransparencyFallbackColor={theme.colors.secondary}
        />
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
