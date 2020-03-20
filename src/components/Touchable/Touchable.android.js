import React, { useState, forwardRef } from 'react';
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  View,
} from 'react-native';
import { useMount } from '../../utils';

const TouchableAndroid = forwardRef(
  (
    {
      highlight,
      borderless = false,
      isAndroidOpacity,
      androidRippleColor,
      onPress,
      children,
      style,
      disableTimeout,
      ...rest
    },
    ref,
  ) => {
    const [clickDisabled, setClickDisabled] = useState(false);
    let clickDisableTimeout;

    useMount(() => () => clearTimeout(clickDisableTimeout));

    function handlePress(...args) {
      if (clickDisabled) {
        return;
      }
      // Prevent the user from being able to click twice
      setClickDisabled(true);
      // Re-enable the button after the timeout
      clickDisableTimeout = setTimeout(() => {
        setClickDisabled(false);
      }, disableTimeout || 200);
      // Call the users click function with all the normal click parameters

      onPress(...args);
    }

    if (isAndroidOpacity) {
      return (
        <TouchableOpacity
          ref={ref}
          accessibilityTraits="button"
          activeOpacity={0.6}
          style={style}
          {...rest}
          onPress={clickDisabled ? () => {} : handlePress}
        >
          {children}
        </TouchableOpacity>
      );
    }

    let background;
    // Android > 5.0 support
    if (Platform.Version >= 21) {
      background = TouchableNativeFeedback.Ripple(
        androidRippleColor || 'rgba(150, 150, 150, 0.5)',
        borderless,
      );
    } else {
      background = TouchableNativeFeedback.SelectableBackground();
    }
    // TouchableNativeFeedback doesn't have a style prop, need to pass style to a view
    let content = children;
    if (style) {
      content = <View style={style}>{children}</View>;
    }
    return (
      <TouchableNativeFeedback
        ref={ref}
        accessibilityTraits="button"
        background={background}
        {...rest}
        onPress={handlePress}
      >
        {content}
      </TouchableNativeFeedback>
    );
  },
);

export default TouchableAndroid;
