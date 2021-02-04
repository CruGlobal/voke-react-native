import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharedStyles = {
  title: {
    // fontSize: theme.fontSizes.l,
  },
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '100%',
  },
  stepsTitle: {
    fontSize: 24,
    paddingHorizontal: 25,
    paddingVertical: 8,
    color: 'white',
  },
  stepText: {
    fontSize: 18,
    paddingHorizontal: 25,
    paddingVertical: 4,
    color: 'white',
    width: '60%',
  },
  startText: {
    fontSize: 20,
    paddingHorizontal: 25,
    paddingVertical: 25,
    color: 'white',
    textAlign: 'center',
  },
  buttonAction: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    width: 250,
  },
  buttonActionLabel: {
    color: theme.colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
