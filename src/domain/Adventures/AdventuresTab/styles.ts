import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...ui,
  TabBarTitle: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.regular,
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
};

export default styles;
