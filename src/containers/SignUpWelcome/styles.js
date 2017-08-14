
import { StyleSheet } from 'react-native';
import theme, { DEFAULT } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  onboardImage: {
    width: 400,
    height: DEFAULT.FULL_HEIGHT- 250,
  },
  imageWrapper: {
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
    fontSize: 18,
  },
  skipButtonText: {
    fontSize: 14,
  },
  skipButton: {
    position: 'absolute',
    bottom: 60,
    right: 40,
  },
  vokeWrap: {
    width: DEFAULT.FULL_WIDTH,
  },
  endButton: {
    alignItems: 'center',
    marginVertical: 50,
    height: 40,
  },
});
