import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  AdventuresSreen: {
    backgroundColor: theme.colors.primary,
  },
  AdventuresList: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.s,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
  },
  AdventureActions: {
    marginLeft: -12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  haveCode: {
    paddingVertical: theme.spacing.m * 1.25,
  },
  haveCodeLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    textDecorationLine: 'underline',
  },

  Heading: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.regular,
    fontWeight: '600',
    textTransform: 'uppercase',
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
    letterSpacing: 0.75,
  },
  BotText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
  BotImage: {
    marginLeft: -30,
  },
  BotMessageTail: {
    marginLeft: 30,
    marginTop: -10,
    transform: [{ rotate: '-90deg' }],
  },
});

export default styles;
