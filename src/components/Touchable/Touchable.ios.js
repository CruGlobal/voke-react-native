import React, { useState, forwardRef } from 'react';
import { TouchableOpacity, TouchableHighlight } from 'react-native';
import { useMount } from 'utils';

const TouchableIOS = forwardRef(
  (
    {
      highlight,
      borderless,
      isAndroidOpacity,
      androidRippleColor,
      onPress,
      disableTimeout,
      ...rest
    },
    ref,
  ) => {
    const [clickDisabled, setClickDisabled] = useState(false);
    let clickDisableTimeout;

    useMount(() => clearTimeout(clickDisableTimeout));

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
    if (highlight) {
      return (
        <TouchableHighlight
          ref={ref}
          accessibilityTraits="button"
          underlayColor="rgba(150, 150, 150, 0.5)"
          onPress={clickDisabled ? () => {} : handlePress}
          {...rest}
        />
      );
    }
    return (
      <TouchableOpacity
        ref={ref}
        accessibilityTraits="button"
        activeOpacity={0.6}
        onPress={clickDisabled ? () => {} : handlePress}
        {...rest}
      />
    );
  },
);

export default TouchableIOS;
