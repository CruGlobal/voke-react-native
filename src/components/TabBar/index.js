import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Flex from '../Flex';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';
import Text from '../Text';
import st from '../../st';
import theme from '../../theme';
import { BlurView, VibrancyView } from "@react-native-community/blur";
import { StyleSheet } from 'react-native';

function tabElement(index, label, isFocused) {
  let iconName = 'adventure';
  if (index === 1) {
    iconName = 'compass';
  }
  if (index === 2) {
    iconName = 'notifications';
  }

  const unReadBadgeCount = useSelector(({ data }) =>
    iconName === 'adventure' ? data.unReadBadgeCount :
    iconName === 'notifications' ? data.notificationUnreadBadge :
    null
  );

  return (
    <Flex
      direction="column"
      align="center"
      style={{
        height: 60,
      }}
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
      {unReadBadgeCount > 0 ? (
        <Flex
          style={[ st.br2, st.bgOrange, st.p8,
          {
            position: "absolute",
            right: "50%",
            top: -4,
            paddingHorizontal: 7,
            marginRight: -30,
          }
          ]}
        >
          <Text style={[st.fs12, st.white, {fontWeight: 'bold', marginBottom: 2}]}>
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
      <SafeAreaView
        edges={['right', 'bottom', 'left']}
        style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.secondary,
            // backgroundColor: "rgba(0,0,0,.4)",
            position: "absolute",
            width: "100%",
            bottom: 0,
            // alignContent: "stretch"

            // Hairline border
            // borderTopColor: "rgba(90, 205, 225, .4)",
            //  borderTopColor: "rgba(0,0,0, .5)",
            // borderTopWidth: StyleSheet.hairlineWidth,
        }}
      >
         {/* <BlurView
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
        /> */}
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

          /* const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          }; */

          return (
            <Touchable
              key={`${label}${index}`}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={()=>{onPress()}}
              style={{flex:1}}
            >
              {tabElement(index, label, isFocused,)}
            </Touchable>
          );
        })}
      </SafeAreaView>
    </>
  );
}

export default TabBar;
