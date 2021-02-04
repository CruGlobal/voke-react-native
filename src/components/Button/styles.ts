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

  buttonStylingSolid: {
    // ...ui.button.style.solid,
  },

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

  textColorSolid: {
    // color: theme.colors.secondary,
  },

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
    // borderRadius: theme.radius.xxl,
  },
  buttonSizeL: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    // borderRadius: theme.radius.xxl,
  },

  // TEXT SIZE:

  text: {
    ...sharedStyles.buttonText,
  },

  textSizeS: {
    fontSize: theme.fontSizes.m,
    lineHeight: theme.fontSizes.m * 1.35,
    // backgroundColor: theme.colors.red,
  },
  iconSizeS: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.m * 1.35,
    marginRight: theme.spacing.xs,
    // backgroundColor: theme.colors.black,
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

  icon: {
    // marginRight: theme.spacing.l,
  },

  /* outerSolidPrimaryL: {
    ...sharedStyles.buttonLarge,
    backgroundColor: theme.colors.primary,
  },
  textSolidPrimaryL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  },
  iconSolidPrimaryL: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  }, */
  // -------------------------
  /* outerSolidSecondaryL: {
    ...sharedStyles.buttonLarge,
    backgroundColor: theme.colors.secondary,
  },
  textSolidSecondaryL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  },
  iconSolidSecondaryL: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  }, */
  // -------------------------

  /* outerSolidBlankL: {
    ...sharedStyles.buttonLarge,
    backgroundColor: theme.colors.white,
  },

  iconSolidBlankL: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.secondary,
  }, */
  // -------------------------

  /* textOutlineBlankL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  },
  textOutlineBlankL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  }, */

  /* iconOutline: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
  },
  iconBlank: {
    color: theme.colors.white,
  }, */
  // -------------------------
  /* text: {
    ...ui.buttonText.size.l,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
  }, */
});

export default styles;
