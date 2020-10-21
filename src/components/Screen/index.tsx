import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import useKeyboard from '@rnhooks/keyboard';
import { SafeAreaView } from 'react-native-safe-area-context';

import DismissKeyboardView from '../DismissKeyboardHOC';

import styles from './styles';
type Props = {
  children?: React.ReactNode;
  testID?: string;
  background?: string;
  // [x: string]: any; // ..rest
};

const Screen = ({
  children,
  testID,
  background,
  // ...rest
}: Props): React.ReactElement => {
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={
        background
          ? [styles.screen, { backgroundColor: background }]
          : styles.screen
      }
      testID={testID}
    >
      {/* Makes possible to hide keyboard when tapping outside. */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}
      >
        <DismissKeyboardView style={styles.dismissKeyboard}>
          <SafeAreaView
            style={
              isKeyboardVisible
                ? styles.safeAreaViewWithKeyboard
                : styles.safeAreaView
            }
          >
            {children}
          </SafeAreaView>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Screen;
