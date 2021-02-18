import React from 'react';
import {
  KeyboardAvoidingView,
  View,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useKeyboard } from '@react-native-community/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

import DismissKeyboardView from '../DismissKeyboardHOC';

import styles from './styles';

const InnerContent = ({
  layout,
  children,
}: // ...rest
Props): React.ReactElement => {
  const keyboard = useKeyboard();
  return (
    <>
      {layout === 'embed' ? (
        <View style={styles.safeAreaViewWithKeyboard}>{children}</View>
      ) : (
        <SafeAreaView
          style={
            keyboard.keyboardShown
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
        // Makes elements inside responsive on the first tap.
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollView}
        scrollEnabled={layout !== 'embed'}
        bounces={bounces}
        scrollIndicatorInsets={{ right: 1 }}
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
