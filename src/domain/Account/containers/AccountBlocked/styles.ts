import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: Record<string, unknown> } = {
  ...ui,
  botMessageBlock: {
    paddingBottom:
      theme.window.height > 600 ? theme.spacing.xxxl : theme.spacing.xxl,
    // Don't set height for bot messages!
    // It should be flexible for every screen.
  },
  reportedCommentReasonText: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
  textReason: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    textAlign: 'center',
    paddingBottom: theme.spacing.l,
  },
  link: {
    textDecorationLine: 'underline',
    color: theme.colors.white,
  },
  textConclusion: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    paddingTop: theme.spacing.l,
  },
};

export default styles;
