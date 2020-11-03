import { StyleSheet } from 'react-native';

import theme from '../../theme';
import ui from '../../ui';

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

  buttonColorBlank: {
    backgroundColor: theme.colors.white,
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
    color: theme.colors.secondary,
  },

  textColorBlank: {
    color: theme.colors.secondary,
  },

  iconColorBlank: {
    color: theme.colors.secondary,
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
  },
  buttonSizeM: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: theme.radius.s,
  },
  buttonSizeL: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderRadius: theme.radius.xxl,
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
    fontSize: theme.fontSizes.m,
    lineHeight: theme.fontSizes.m * 1.35,
  },
  textSizeM: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.35,
  },
  iconSizeM: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.35,
  },
  textSizeL: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
  },
  iconSizeL: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
  },

  // -------------------------

  icon: {
    marginRight: theme.spacing.l,
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
