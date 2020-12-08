import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import st from 'utils/st';

import Touchable from '../Touchable';

type ButtonProps = {
  onPress?: Function;
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTextStyle?: StyleProp<TextStyle>; // StyleSheet?
  style?: StyleProp<ViewStyle>; // StyleSheet?
  touchableStyle?: StyleProp<ViewStyle>;
  isAndroidOpacity?: boolean;
  activeOpacity?: number;
  type?: string;
  text?: string;
  [x: string]: any;
};
/**
 * Our custom button component.
 */
const OldButton = ({
  onPress,
  children,
  disabled,
  isLoading,
  style,
  touchableStyle,
  testID,
  ...rest
}: ButtonProps) => {
  const [clickDisabled, setClickDisabled] = useState(false);
  let clickDisableTimeout = null;

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
      style={touchableStyle}
      disabled={isDisabled}
      onPress={isDisabled ? () => {} : () => handlePress()}
      testID={testID}
    >
      <View style={[disabled || isLoading ? [st.bw0, st.aic] : [], style]}>
        {content}
      </View>
    </Touchable>
  );
};
export default OldButton;
