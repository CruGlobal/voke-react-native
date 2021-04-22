import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  reactions: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
  },
  reactionPill: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.l,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    marginLeft: theme.spacing.s,
    marginBottom: theme.spacing.xs,
  },
  reactionLabel: {
    fontSize: theme.fontSizes.xxs,
    color: theme.colors.secondary,
    paddingRight: theme.spacing.xs,
  },
  reactionLabelOwn: {
    fontSize: theme.fontSizes.xxs,
    lineHeight: theme.fontSizes.xxs * 1.3,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    paddingRight: theme.spacing.xs,
  },
});

export default styles;
