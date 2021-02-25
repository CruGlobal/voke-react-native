import theme from 'utils/theme';

const styles: { [key: string]: any } = {
  ...theme,
  settingOption: {
    color: '#fff',
    fontSize: theme.fontSizes.l,
  },

  langOption: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 14,
    flexDirection: 'row',
    width: '100%',
  },
  langOptionText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
  },
  langOptionCheckmark: {
    color: theme.colors.secondary,
    alignSelf: 'center',
    paddingLeft: theme.spacing.s,
    opacity: 0.5,
  },
};

export default styles;
