import { StyleSheet } from 'react-native';

import theme from 'utils/theme';

const styles = StyleSheet.create({
  label: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    minHeight: 26,
  },
  button: {
    textAlign: 'center',
    paddingLeft: 25,
    paddingVertical: 10,
    width: '100%',

    height: 50,
    color: theme.colors.white,
    fontSize: 24,

    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryAlt,

    paddingRight: 30, // to ensure the text is never behind the icon
  },
  buttonLabel: {
    color: theme.colors.white,
    fontSize: 24,
    textAlign: 'center',
  },
  descriptionContainer: {
    width: '100%',
    minHeight: theme.spacing.xl,
  },
  descriptionText: {
    color: theme.colors.secondary,
    paddingTop: 10,
    fontSize: theme.fontSizes.s,
    alignSelf: 'center',
  },
});

export default styles;
