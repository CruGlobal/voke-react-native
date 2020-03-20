import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import Touchable from '../Touchable';
import st from '../../st';

function Button({
  onPress,
  children,
  disabled,
  isLoading,
  style,
  touchableStyle,
  ...rest
}) {
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
