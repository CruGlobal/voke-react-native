import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: Record<string, unknown> } = {
  ...ui,
  reportedComment: {
    width: '100%',
    borderRadius: theme.radius.s,
    ...theme.shadow,
  },
  reportedCommentMain: {
    backgroundColor: theme.colors.white,
    width: '100%',
    padding: theme.spacing.m,
    borderTopStartRadius: theme.radius.s,
    borderTopEndRadius: theme.radius.s,
  },
  reportedCommentReason: {
    backgroundColor: theme.colors.secondary,
    width: '100%',
    padding: theme.spacing.m,
    borderBottomStartRadius: theme.radius.s,
    borderBottomEndRadius: theme.radius.s,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,.3)',
    borderStyle: 'solid',
  },
  reportedUser: {
    flexDirection: 'row',
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: 50,
  },
  userName: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
    fontWeight: '600',
    paddingBottom: theme.spacing.s,
    justifyContent: 'center',
  },
  reportedMessage: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
  },
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
