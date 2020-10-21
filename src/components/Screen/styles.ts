import { StyleSheet } from 'react-native';

import theme from '../../theme';

const sharredStyles = {
  safeAreaView: {
    height: '100%',
    paddingHorizontal:
      theme.window.width < 375 ? theme.spacing.l : theme.spacing.xl,
    // Responsive horizontal paddings for screen content area.
  },
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    height: '100%',
  },
  scrollView: {
    minHeight: '100%',
    alignItems: 'center',

    // Extra vertical spacing for tablets.
    paddingVertical: theme.window.width > 700 ? theme.spacing.xl : 0,
  },
  dismissKeyboard: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
  },
  safeAreaView: {
    ...sharredStyles.safeAreaView,
    justifyContent: 'center',
  },
  safeAreaViewWithKeyboard: {
    ...sharredStyles.safeAreaView,
  },
});

export default styles;
