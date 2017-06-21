import React from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

function TouchableIOS(props) {
  if (props.highlight) {
    return (
      <TouchableHighlight
        accessibilityTraits="button"
        underlayColor="#3C5EAE"
        {...props}
      />
    );
  } else {
    return (
      <TouchableOpacity
        accessibilityTraits="button"
        activeOpacity={0.6}
        {...props}
      />
    );
  }
}

function TouchableAndroid(props) {
  return (
    <TouchableNativeFeedback
      background={TouchableNativeFeedback.Ripple('rgba(180, 180, 190, 0.5)', false)}
      {...props}
    />
  );
}

const Touchable = Platform.OS === 'android' ? TouchableAndroid : TouchableIOS;

export default Touchable;
