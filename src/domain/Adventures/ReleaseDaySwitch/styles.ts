import theme from 'utils/theme';

const styles: { [key: string]: any } = {
  ...theme,
  dayOptionBlock: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',

    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryAlt,
    marginBottom: theme.spacing.xl,
  },
  dayOptionLabel: {
    color: theme.colors.white,
    fontSize: 24,
    textAlign: 'center',
  },
  dayOptionTitle: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
    minHeight: 26,
    paddingBottom: theme.spacing.s,
  },
  dayOptionText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
  },
  dayOptionCheckmark: {
    color: theme.colors.secondary,
    alignSelf: 'center',
    paddingLeft: theme.spacing.s,
    opacity: 0.5,
  },
};

export default styles;
