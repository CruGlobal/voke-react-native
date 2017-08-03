
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrap: {
    paddingVertical: 30,
  },
  onboardingPage: {
    backgroundColor: theme.primaryColor,
  },
  headerText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 15,
  },
  inputs: {
    paddingBottom: 50,
  },
  skipButtonText: {
    fontSize: 14,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 8,
    marginRight: 30,
  },
  skipButton: {
    position: 'absolute',
    bottom: 60,
    right: 40,
  },
  endButton: {
    alignItems: 'center',
    marginVertical: 50,
  },
});
