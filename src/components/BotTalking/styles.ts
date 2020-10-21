import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  BotContainer: {
    // paddingHorizontal: theme.spacing.l,
    marginTop: theme.spacing.m,
    alignSelf: theme.window.width > 500 ? 'center' : 'auto',
  },
  BotInner: {
    // for Tablets:
    maxWidth: 440,
  },
  BotMessage: {
    width: '100%',
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.m,
    paddingBottom: 12,
  },

  BotHeading: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
    paddingBottom: theme.spacing.s,
  },
  BotHeading_overlay: {
    color: theme.colors.secondaryAlt,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  BotText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    // Extra spacing for body text.
    paddingHorizontal: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  BotCharacter: {
    alignSelf: 'flex-start', // For tablets.
  },
  BotImage: {
    marginLeft: -70,
    marginTop: -25,
    marginBottom: -25,
  },
  BotMessageTail: {
    marginLeft: 40,
    marginTop: -10,
    transform: [{ rotate: '-90deg' }],
    zIndex: -1,
  },
  BotMessage_reverse: {
    width: '100%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
    borderRadius: theme.radius.m,
  },
  BotText_reverse: {
    color: theme.colors.secondaryAlt,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
  BotImage_reverse: {
    marginLeft: -30,
  },
  BotMessage_overlay: {
    width: '90%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.s,
    borderRadius: theme.radius.m,
    margin: 'auto',
    marginTop: 40,
  },
  BotImage_overlay: {
    marginLeft: -85,
    marginTop: -25,
  },
});

export default styles;
