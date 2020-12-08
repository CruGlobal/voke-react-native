import { StyleSheet } from 'react-native';

import theme from 'utils/theme';

const styles = StyleSheet.create({
  container: {

  },
  ctaInfoBlockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.s,
    justifyContent: 'center',
  },
  ctaInfoBlockToggleText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },

  textMain: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    // textShadowColor: 'rgba(32, 20, 16, .8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingTop: 20,
  },
});

export default styles;
