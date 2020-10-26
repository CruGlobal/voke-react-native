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

const InnerContent = ({
  layout,
  children,
}: // ...rest
Props): React.ReactElement => {
  const [isKeyboardVisible] = useKeyboard();
  return (
    <>
      {layout === 'embed' ? (
        <View style={styles.safeAreaViewWithKeyboard}>{children}</View>
      ) : (
        <SafeAreaView
          style={
            isKeyboardVisible
              ? styles.safeAreaViewWithKeyboard
              : styles.safeAreaView
          }
          // Disable safe are for embed views (login form inside a modal).
          edges={['top', 'right', 'bottom', 'left']}
        >
          {children}
        </SafeAreaView>
      )}
    </>
  );
};

type Props = {
  children?: React.ReactNode;
  testID?: string;
  background?: string;
  noKeyboard?: boolean;
  layout?: 'embed' | null;
  bounces?: boolean;
  // [x: string]: any; // ..rest
};

const Screen = ({
  children,
  testID,
  background,
  noKeyboard,
  layout,
  bounces = true,
}: // ...rest
Props): React.ReactElement => {
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();
  return (
    <KeyboardAvoidingView
      enabled={!noKeyboard}
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
        scrollEnabled={layout !== 'embed'}
        bounces={bounces}
      >
        {noKeyboard ? (
          <View style={styles.dismissKeyboard}>
            <InnerContent layout={layout}>{children}</InnerContent>
          </View>
        ) : (
          <DismissKeyboardView style={styles.dismissKeyboard}>
            <InnerContent layout={layout}>{children}</InnerContent>
          </DismissKeyboardView>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Screen;
