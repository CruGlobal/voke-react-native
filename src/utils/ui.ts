import theme from 'utils/theme';

const ui: { [key: string]: any } = {
  ...theme,
  button: {
    size: {
      m: {
        paddingVertical: 4,
        paddingHorizontal: 14,
        borderRadius: theme.radius.s,
      },
      l: {
        paddingVertical: 20,
        paddingHorizontal: theme.spacing.s,
        borderRadius: theme.radius.xxl,
      },
      outlinel: {
        padding: 16,
        borderRadius: theme.radius.m,
      },
    },
    style: {
      primary: {
        backgroundColor: theme.colors.primary,
      },
      solid: {
        backgroundColor: theme.colors.white,
      },
      outline: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: theme.colors.white,
      },
    },
  },
  buttonText: {
    size: {
      m: {
        fontSize: theme.fontSizes.l,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
      },
      l: {
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.fontSizes.xl * 1.35,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
      },
      wl: {
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.fontSizes.xl * 1.35,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
      },
      wm: {
        fontSize: theme.fontSizes.l,
        fontFamily: theme.fonts.semiBold,
        textAlign: 'center',
      },
    },
    style: {
      primary: {
        color: theme.colors.white,
      },
      solid: {
        color: theme.colors.secondary,
      },
      outline: {
        color: theme.colors.white,
      },
    },
  },
  container: {
    default: {
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.primary,
      width: '100%',
    },
  },
};

export default ui;
