import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingVertical: theme.spacing.xl,
    justifyContent: 'center',
  },
  scrollView: {
    minHeight: '100%',
    flexDirection: 'column',
    alignContent: 'stretch',
    justifyContent: 'flex-end',
  },
  introText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  textResult: {
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  button: {
    width: '100%',
    padding: theme.spacing.m,
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.white,
    marginTop: theme.spacing.xl,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 4,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 8 },
  },
  buttonLabel: {
    fontSize: theme.fontSizes.xl,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  releaseDate: {
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
    paddingBottom: theme.spacing.s,
    color: theme.colors.black,
  },
  releaseDue: { color: theme.colors.secondary },
  manual: {
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
    color: theme.colors.secondary,
  },
  manualPicture: {
    marginVertical: theme.spacing.l,
  },
  manualSecondary: {
    textAlign: 'center',
    color: theme.colors.secondary,
  },
});

export default styles;
