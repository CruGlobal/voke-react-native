import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Flex from '../Flex';
import Button from '../Button';
import Touchable from '../Touchable';
import { useDispatch,useSelector } from 'react-redux';
import theme from '../../theme';
import { logoutAction } from '../../actions/auth';
import { useNavigation } from '@react-navigation/native';

type SignOutProps = {
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
const SignOut = ({
  onPress,
  children,
  disabled,
  isLoading,
  style,
  touchableStyle,
  ...rest
}: SignOutProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [clickDisabled, setClickDisabled] = useState(false);
  const email = useSelector(({ auth }: any) => auth?.user?.email);
  let clickDisableTimeout = null;
  useEffect(
    () =>
      (cleanUp = () => {
      clearTimeout(clickDisableTimeout);
    }),
    [],
  );

  function handlePress() {
    setClickDisabled(true);
    clickDisableTimeout = setTimeout(() => {
      setClickDisabled(false);
    }, 500);
    onPress();
  }

  return (
    <>{!!email && (<Button
      isAndroidOpacity={true}
      onPress={
        () => dispatch(logoutAction()).then(() => {
          // Navigate back to the very first screen.
          // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
          setTimeout(() => {
            navigation.reset({
              index: 1,
              routes: [{ name: 'Welcome' }],
            });
          }, 10);
        })
      }
      style={{
        /* padding: theme.spacing.m, */
      }}
    >
      <Flex
        // value={1}
        direction="row"
        align="center"
        justify="center"
      >
        <Text
          style={{
            padding: theme.spacing.m,
            color:  theme.colors.white,
            fontSize:  theme.fontSizes.l,
          }}
        >Sign out</Text>
      </Flex>
    </Button>)}</>
  );
};
export default SignOut;
