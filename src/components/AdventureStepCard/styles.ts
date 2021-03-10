import { StyleSheet, Platform } from 'react-native';
import theme from 'utils/theme';

const sharedStyles = {
  title: {
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.xl,
    paddingTop: theme.spacing.s,
  },
};

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
    height: '100%',
  },
  stepCard: {
    marginBottom: theme.spacing.xxs,
    borderRadius: theme.radius.m,
    overflow: 'hidden',
  },
  cardContent: {
    minHeight: 110,
  },
  stepWrapper: {
    paddingBottom: theme.spacing.s,
  },
  thumbContainer: {
    justifyContent: 'center',
  },
  thumb: {
    width: 140,
    flex: 1,
  },
  thumbIcon: {
    opacity: 0.9,
    width: 30,
    height: 30,
    color: theme.colors.white,
    position: 'absolute',
    alignSelf: 'center',
  },
  titleActive: {
    ...sharedStyles.title,
    color: theme.colors.secondary,
  },
  titleInactive: {
    ...sharedStyles.title,
    color: theme.colors.white,
  },
  partActive: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.secondary,
  },
  partInactive: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
  stepNumberContainer: {
    position: 'absolute',
    bottom: -28,
    right: 0,
    paddingHorizontal: theme.spacing.s,
  },
  stepNumber: {
    fontSize: 72,
  },
  completedBlock: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.s,
    borderRadius: theme.radius.xxl,
    ...Platform.select({
      ios: {
        top: -4,
        right: -4,
      },
      android: {
        top: 0,
        right: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: theme.radius.m,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: theme.radius.l,
      },
    }),
  },
  iconCompleted: {
    color: theme.colors.white,
  },
  unreadBubble: {
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.accent,
    marginRight: theme.spacing.s,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
  },
  iconUnread: {
    color: theme.colors.white,
    marginTop: -1,
    marginRight: 6,
  },
  nextReleaseBlock: {
    backgroundColor: theme.colors.accent,
    width: '100%',
    paddingVertical: theme.spacing.xs,
  },
  nextReleaseText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.35,
  },
  nextStepLocked: {
    flexDirection: 'row',
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  nextStepLockedText: {
    fontSize: theme.fontSizes.l,
    fontWeight: '600',
    paddingRight: theme.spacing.s,
    color: theme.colors.secondary,
  },
  waitingBlock: {
    backgroundColor: theme.colors.accent,
    width: '100%',
    paddingVertical: theme.spacing.xs,
  },
  waitingText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    lineHeight: theme.fontSizes.l * 1.35,
  },
  nextStepLocked: {
    flexDirection: 'row',
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
  },
  nextStepLockedText: {
    fontSize: theme.fontSizes.l,
    fontWeight: '600',
    paddingRight: theme.spacing.s,
    color: theme.colors.secondary,
  },
});

export default styles;
