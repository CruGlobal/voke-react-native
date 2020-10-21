import { StyleSheet } from 'react-native';

import theme from '../../theme';

const sharredStyles = {
  safeAreaView: {
    alignItems: 'center',
    height: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: theme.colors.red,
    paddingHorizontal: theme.spacing.xl,
  },
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    height: '100%',
    // justifyContent: 'center',
  },
  scrollView: {
    minHeight: '100%',
    alignContent: 'stretch',
    // flexDirection: 'column',
    // justifyContent: 'center',
  },
  dismissKeyboard: {
    flex: 1,
  },
  safeAreaView: {
    ...sharredStyles.safeAreaView,
    justifyContent: 'center',
  },
  safeAreaViewWithKeyboard: {
    ...sharredStyles.safeAreaView,
  }
});

export default styles;
