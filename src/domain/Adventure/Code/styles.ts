import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharredStyles = {
  safeAreaView: {
    alignItems: 'center',
    height: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.xl,
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
    alignContent: 'stretch',
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
  },
});

export default styles;
