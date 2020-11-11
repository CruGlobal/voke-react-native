import React, { FunctionComponent } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  GestureResponderEvent,
} from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import { capitalize, upperCase } from '../../utils';
import Touchable from '../Touchable';
import VokeIcon from '../VokeIcon';

import styles from './styles';
interface StylingProps {
  styling?: 'solid' | 'outline';
  color?: 'primary' | 'secondary' | 'accent' | 'blank';
  size?: 's' | 'm' | 'l';
  radius?: 's' | 'm' | 'l' | 'xxl';
  shadow?: boolean;
}

interface ButtonProps extends StylingProps {
  onPress?: Function;
  children?: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTextStyle?: StyleProp<TextStyle>; // StyleSheet?
  style?: StyleProp<ViewStyle>; // StyleSheet?
  touchableStyle?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  icon?: 'mail' | 'apple' | 'facebook' | 'share';
  type?: string;
  text?: string;
  testID?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

interface GetStylesProps extends StylingProps {
  element: 'button' | 'text' | 'icon';
}

const getStyles = ({
  element,
  size,
  color,
  styling,
  shadow,
  radius,
}: GetStylesProps): (ViewStyle | ImageStyle)[] => {
  const el = element;
  // Conditional Color Customization.
  let applyColor: string = color || '';
  if (styling === 'outline' && color === 'blank') {
    applyColor = styling + capitalize(color);
  }
  // Need the next check to prove to TypeScript
  // that styleName is among indexes in the stylesheet.
  const stSize = `${el}Size${capitalize(size)}` as keyof typeof styles;
  const stStyling = `${el}Styling${capitalize(styling)}` as keyof typeof styles;
  const stColor = `${el}Color${capitalize(applyColor)}` as keyof typeof styles;
  const stRadius = `${el}Radius${upperCase(radius)}` as keyof typeof styles;
  // Put all styles together.
  let composedStyles = [
    styles[element],
    styles[stSize],
    styles[stColor],
    styles[stStyling],
    styles[stRadius],
  ];
  // Conditionally add extra styles for shadows.
  if (element === 'button' && shadow) {
    composedStyles = [...composedStyles, styles.shadow];
  }
  return composedStyles;
};
/**
 * Our custom button component.
 */
const Button: FunctionComponent<ButtonProps> = ({
  onPress = (): void => {
    return;
  },
  children,
  disabled,
  isLoading,
  styling = 'solid',
  color = 'primary',
  size = 'm',
  radius = 'xxl',
  icon,
  testID,
  shadow = false,
  ...rest
}) => {
  const stylesOuter = getStyles({
    element: 'button',
    styling,
    color,
    size,
    shadow,
    radius,
  });
  const stylesText = getStyles({ element: 'text', styling, color, size });
  const stylesIcon = getStyles({ element: 'icon', styling, color, size });

  const handlePress = useDebouncedCallback(
    (event: GestureResponderEvent) => {
      if (!isLoading) {
        onPress(event);
      }
    },
    800, //delay in ms
    { leading: true, trailing: false },
  );

  const isDisabled = disabled || isLoading;

  return (
    <Touchable
      {...rest}
      style={stylesOuter}
      disabled={isDisabled}
      onPress={
        isDisabled
          ? (): void => {
              return;
            }
          : (event: GestureResponderEvent): void => handlePress.callback(event)
      }
      testID={testID}
    >
      <View style={styles.inner}>
        {!!icon && !isLoading && <VokeIcon name={icon} style={stylesIcon} />}
        <Text style={stylesText}>{isLoading ? ' ' : children}</Text>
        {!!isLoading && (
          <View style={{ position: 'absolute', alignSelf: 'center' }}>
            <ActivityIndicator size="small" color="#216373" />
          </View>
        )}
      </View>
    </Touchable>
  );
};
export default Button;
