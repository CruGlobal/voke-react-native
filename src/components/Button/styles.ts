import { StyleSheet } from 'react-native';

import theme from '../../theme';
import ui from '../../ui';

const sharedStyles = {
  buttonText: {
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: theme.spacing.l,
  },
  // TEXT SIZE:
  buttonTextMedium: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.35,
  },
  buttonTextLarge: {
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.35,
  },
  // OUTER SIZE:
  buttonLarge: {
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.radius.xxl,
  },
  buttonMedium: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: theme.radius.s,
  },
  // EXTRA:
  buttonOutline: {
    borderStyle: 'solid',
    borderWidth: 1,
    // borderColor: theme.colors.white,
  }
};

const styles = StyleSheet.create({
  outerPrimary: {
    ...sharedStyles.buttonLarge,
    ...ui.button.style.primary,
  },
  outerSolid: {
    ...sharedStyles.buttonLarge,
    ...ui.button.style.solid,
  },
  outerSolidPrimaryM: {
    ...ui.button.size.m,
    ...ui.button.style.primary,
  },
  // -------------------------
  outerSolidPrimaryL: {
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
  },
  // -------------------------
  outerSolidEmptyL: {
    ...sharedStyles.buttonLarge,
    backgroundColor: theme.colors.white,
  },
  textSolidEmptyL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.secondary,
  },
  iconSolidEmptyL: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.secondary,
  },
  // -------------------------
  outerOutlineEmptyL: {
    ...sharedStyles.buttonLarge,
    ...sharedStyles.buttonOutline,
    borderColor: theme.colors.white,
  },
  textOutlineEmptyL: {
    ...sharedStyles.buttonText,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  },
  iconOutlineEmptyL: {
    ...sharedStyles.buttonIcon,
    ...sharedStyles.buttonTextLarge,
    color: theme.colors.white,
  },
  // -------------------------

  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...ui.buttonText.size.l,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
  },
});

export default styles;
