import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { capitalize } from '../../utils';
import Touchable from '../Touchable';
import st from '../../st';
import VokeIcon from '../VokeIcon';

import styles from './styles';

type ButtonProps = {
  onPress?: Function;
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTextStyle?: StyleProp<TextStyle>; // StyleSheet?
  style?: StyleProp<ViewStyle>; // StyleSheet?
  touchableStyle?: StyleProp<ViewStyle>;
  // isAndroidOpacity?: boolean;
  activeOpacity?: number;
  styling?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'empty';
  size?: 's' | 'm' | 'l';
  icon?: 'mail' | 'apple' | 'facebook';
  type?: string;
  text?: string;
  testID?: string;
  [x: string]: any;
};
/**
 * Our custom button component.
 */
const Button = ({
  onPress,
  children,
  disabled,
  isLoading,
  style,
  touchableStyle,
  styling = 'solid',
  color = 'primary',
  size = 'm',
  icon,
  testID,
  ...rest
}: ButtonProps) => {
  const [clickDisabled, setClickDisabled] = useState(false);
  let clickDisableTimeout = null;
  const stylesOuter =
    styles[
      'outer' + capitalize(styling) + capitalize(color) + capitalize(size)
    ];
  const stylesText =
    styles['text' + capitalize(styling) + capitalize(color) + capitalize(size)];

  const stylesIcon =
    styles['icon' + capitalize(styling) + capitalize(color) + capitalize(size)];

  useEffect(() => {
    return () => {
      clearTimeout(clickDisableTimeout);
    };
  }, []);

  function handlePress() {
    setClickDisabled(true);
    onPress();
    clickDisableTimeout = setTimeout(() => {
      setClickDisabled(false);
    }, 500);
  }

  let content = children;
  if (isLoading) {
    // Show loading indicator on top of the current button label.
    // To make button keep the same height we hide the label with opacity
    // instead of removing it from the screen.
    content = (
      <View style={{ justifyContent: 'center' }}>
        <View style={{ position: 'absolute', alignSelf: 'center' }}>
          <ActivityIndicator size="small" color="#216373" />
        </View>
        <View style={{ opacity: 0 }}>{content}</View>
      </View>
    );
  }
  const isDisabled = disabled || clickDisabled || isLoading;
  return (
    <Touchable
      {...rest}
      style={stylesOuter}
      disabled={isDisabled}
      onPress={isDisabled ? () => {} : () => handlePress()}
      testID={testID}
    >
      <View
        /* style={[
          disabled || isLoading ? [ st.bw0, st.aic] : [],
          style,
        ]} */
        style={styles.inner}
      >
        { icon && <VokeIcon
          name={icon}
          // size={22}
          style={stylesIcon}
        /> }
        <Text style={stylesText}>{content}</Text>
      </View>
    </Touchable>
  );
};
export default Button;
