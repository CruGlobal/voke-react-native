import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
import ui from 'utils/ui';

const sharedStyles = {
  buttonText: {
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },

  // OUTER SIZE:

  // EXTRA:
  buttonOutline: {
    borderStyle: 'solid',
    borderWidth: 1,
  },
};

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {},

  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 4,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 8 },
  },

  buttonStylingSolid: {},

  buttonStylingOutline: {
    ...sharedStyles.buttonOutline,
  },

  // -------------------------
  // COLORS:

  buttonColorPrimary: {
    backgroundColor: theme.colors.primary,
  },

  buttonColorSecondary: {
    backgroundColor: theme.colors.secondary,
  },

  buttonColorBlank: {
    backgroundColor: theme.colors.white,
  },

  buttonColorAccent: {
    backgroundColor: theme.colors.accent,
  },

  buttonColorOutlineBlank: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.white,
  },

  // TEXT COLORS:

  textColorPrimary: {
    color: theme.colors.white,
  },

  textColorSecondary: {
    color: theme.colors.white,
  },

  iconColorSecondary: {
    color: theme.colors.white,
  },

  textColorTransparent: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
  },

  iconColorTransparent: {
    color: theme.colors.primary,
  },

  textColorTransparentSecondary: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.semiBold,
  },

  iconColorTransparentSecondary: {
    color: theme.colors.secondary,
  },

  textColorBlank: {
    color: theme.colors.secondary,
  },

  iconColorBlank: {
    color: theme.colors.secondary,
  },

  textColorAccent: {
    color: theme.colors.white,
  },

  iconColorAccent: {
    color: theme.colors.white,
  },

  textColorOutlineBlank: {
    color: theme.colors.white,
  },

  iconColorOutlineBlank: {
    color: theme.colors.white,
  },

  textColorSolid: {},

  iconColorSolid: {
    color: theme.colors.secondary,
  },

  // -------------------------
  // SIZES:

  buttonSizeS: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.m,
  },
  buttonSizeM: {
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.l,
  },
  buttonSizeL: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },

  // TEXT SIZE:

  text: {
    ...sharedStyles.buttonText,
  },

  textSizeS: {
    fontSize: theme.fontSizes.m,
    lineHeight: theme.fontSizes.m * 1.35,
  },
  iconSizeS: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.m * 1.35,
    marginRight: theme.spacing.xs,
  },
  textSizeM: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.5,
  },
  iconSizeM: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l,
    marginRight: theme.spacing.s,
  },
  textSizeL: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
  },
  iconSizeL: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
    marginRight: theme.spacing.l,
  },

  // -------------------------
  // RADIUS:

  buttonRadiusS: {
    borderRadius: theme.radius.s,
  },
  buttonRadiusM: {
    borderRadius: theme.radius.m,
  },
  buttonRadiusL: {
    borderRadius: theme.radius.xl,
  },
  buttonRadiusXXL: {
    borderRadius: theme.radius.xxl,
  },

  // -------------------------

  icon: {},
});

export default styles;
