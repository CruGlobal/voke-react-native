import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharedStyles = {
  message: {
    width: '100%',
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.m,
    paddingBottom: 12,
  },

  heading: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
    paddingBottom: theme.spacing.s,
  },
  text: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    // Extra spacing for body text.
    paddingHorizontal: theme.spacing.s,
    paddingBottom: theme.spacing.m,
  },
};

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
    ...sharedStyles.message,
  },
  BotHeading: {
    ...sharedStyles.heading,
  },
  BotText: {
    ...sharedStyles.text,
  },

  BotOverlayMessage: {
    ...sharedStyles.message,
    backgroundColor: theme.colors.white,
  },
  BotOverlayHeading: {
    ...sharedStyles.heading,
    color: theme.colors.secondaryAlt,
  },
  BotOverlayText: {
    ...sharedStyles.text,
    color: theme.colors.secondary,
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
  BotMessage_uke: {
    width: '100%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.l,
    borderRadius: theme.radius.m,
  },
  BotText_uke: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.4,
    textAlign: 'center',
  },
  BotImage_uke: {
    marginLeft: -90,
    marginTop: -30,
    marginBottom: -30,
    zIndex: -1,
  },

  BotImage_overlay: {
    marginLeft: -85,
    marginTop: -25,
  },
});

export default styles;
