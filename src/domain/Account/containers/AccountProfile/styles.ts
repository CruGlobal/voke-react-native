import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...theme,
  SectionAction: {
    paddingLeft: theme.spacing.xl,
    paddingRight: theme.spacing.xl,
  },

  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },

  settingLabel: {
    color: '#fff',
    fontSize: theme.fontSizes.l,
  },

  settingOption: {
    color: '#fff',
    fontSize: theme.fontSizes.l,
  },

  ButtonSignUp: [ui.button.size.outlinel, ui.button.style.outline],
  ButtonSignUpLabel: [ui.buttonText.size.m, ui.buttonText.style.outline],
  ButtonActionLabel: [
    ui.buttonText.size.m,
    {
      marginTop: theme.spacing.l,
      textDecorationLine: 'underline',
    },
  ],
  ButtonActionTextOnly: [
    {
      marginTop: 10,
      textAlign: 'center',
      textDecorationLine: 'underline',
      color: theme.colors.white,
    },
  ],
};

export default styles;
