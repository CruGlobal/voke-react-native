import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Touchable from '../Touchable';
import st from '../../st';


type ButtonProps = {
  onPress?: Function,
  children?: React.ReactNode,
  disabled?: boolean,
  isLoading?: boolean,
  buttonTextStyle?: StyleProp<TextStyle>, // StyleSheet?
  style?: StyleProp<ViewStyle>, // StyleSheet?
  touchableStyle?: StyleProp<ViewStyle>,
  isAndroidOpacity?: boolean,
  activeOpacity?: number,
  type?: string,
  text?: string,
  [x:string]: any,
}
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
  ...rest
}:ButtonProps) => {
  const [clickDisabled, setClickDisabled] = useState(false);
  useEffect(() => {
    return (cleanUp = () => {
      clearTimeout(this.clickDisableTimeout);
    });
  }, []);

  function handlePress() {
    setClickDisabled(true);
    this.clickDisableTimeout = setTimeout(() => {
      setClickDisabled(false);
    }, 500);
    onPress();
  }

  let content = children;
  if (isLoading) {
    content = <ActivityIndicator size="small" />;
  }
  const isDisabled = disabled || clickDisabled || isLoading;
  return (
    <Touchable
      {...rest}
      style={touchableStyle}
      disabled={isDisabled}
      onPress={isDisabled ? () => {} : () => handlePress()}
    >
      <View
        style={[
          disabled || isLoading ? [st.bgDarkBlue, st.bw0, st.aic] : [],
          style,
        ]}
      >
        {content}
      </View>
    </Touchable>
  );
}
export default Button;
