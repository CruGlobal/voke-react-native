import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
const THUMBNAIL_WIDTH = 140;
const styles = StyleSheet.create({
  InviteWrapper: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
  },
  InviteBlock: {
    borderRadius: theme.radius.m,
    backgroundColor: theme.colors.secondary,
    minHeight: 100,
  },
  InviteBlockContent: {
    paddingTop: theme.spacing.s,
    paddingBottom: theme.spacing.s,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.m,
    minHeight: 90,
  },
  CodeBlock: {
    // ui.button.size.m:
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: theme.radius.s,

    paddingLeft: 0,
  },
  Code: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
  ButtonReset: {
    // ui.button.size.m:
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.accent,
  },
  ButtonResetLabel: {
    // ui.buttonText.size.s
  },
  thumbnail: {
    flex: 1,
    width: THUMBNAIL_WIDTH,
    // borderRadius: theme.radius.s,
    borderTopLeftRadius: theme.radius.s,
    borderBottomLeftRadius: theme.radius.s,
  },
  iconDeleteContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 50,
    zIndex: 99,
  },
  iconDeleteTouch: {
    borderRadius: theme.radius.l,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingBottom: theme.spacing.s,
  },
  iconDelete: {
    color: theme.colors.white,
    fontSize: 12,
  },
});

export default styles;
