import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const sharedStyles = {
  avatar: {
    position: 'absolute' as const,
    bottom: 0,
    height: 25,
    width: 25,
    borderRadius: 50,
  },
  messageBubble: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden' as const, // Needed to hide overflow blur eff.
  },
};

const styles = StyleSheet.create({
  container: {
    // align 'between'
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
    zIndex: 1, // Needed to make context menu covering all other elements.
  },
  content: {
    paddingHorizontal: theme.spacing.l,
  },
  messageBubbleOthers: {
    ...sharedStyles.messageBubble,
    backgroundColor: theme.colors.secondary,
  },
  messageBubbleMine: {
    ...sharedStyles.messageBubble,
    backgroundColor: theme.colors.white,
  },
  author: {
    color: theme.colors.white,
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    marginBottom: -theme.spacing.m,
    fontFamily: theme.fonts.semiBold,
    opacity: 0.75,
  },
  sharedContent: {
    marginTop: theme.spacing.l,
    padding: theme.spacing.l,
  },
  sharedText: {
    fontSize: theme.fontSizes.m,
  },
  messageText: {
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.l,
    fontSize: theme.fontSizes.l,
  },
  myAvatar: {
    ...sharedStyles.avatar,
    right: -30,
  },
  userAvatar: {
    ...sharedStyles.avatar,
    left: -30,
    backgroundColor: theme.colors.secondaryAlt,
  },
  messageMeta: {
    paddingTop: theme.spacing.xs,
    flexDirection: 'row',
  },
  date: {
    textAlign: 'right',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.white,
  },
});

export default styles;
