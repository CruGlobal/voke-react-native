import { StyleSheet } from 'react-native';

import theme from 'utils/theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: theme.spacing.s,
  },
  card: {
    borderRadius: theme.radius.s,
    backgroundColor: theme.colors.white,
  },
  thumbnail: {
    flex: 1,
    marginLeft: 5, // TODO: replace with our units.
    marginTop: 6,
    marginBottom: 6,
    width: THUMBNAIL_WIDTH,
    borderRadius: theme.radius.s,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.s,
    paddingLeft: theme.spacing.m,
    paddingRight: theme.spacing.xs,
    width: '100%',
  },
  title: {
    width: '100%',
    paddingRight: theme.spacing.s,
    paddingBottom: theme.spacing.s,
    color: theme.colors.darkGrey,
    fontSize: theme.fontSizes.l,
    fontFamily: theme.fonts.regular,
    lineHeight: theme.fontSizes.xl * 1.25,
    textAlign: 'left',
  },
  iconDeleteWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: theme.spacing.s,
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
  iconDeleteIcon: {
    color: '#DADADA',
  },
  participants: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
  },
  avatars: {
    width: '100%',
    paddingBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -3,
  },
  avatarInGroup: {
    // avatar
    width: 36,
    height: 36,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',

    marginLeft: -14,
  },
  avatarSolo: {
    // avatar
    width: 36,
    height: 36,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',

    marginLeft: -12,
  },
  completedLine: {
    color: theme.colors.darkGrey,
    fontSize: theme.fontSizes.s,
  },
  solotag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.secondaryAlt,
    marginBottom: '-5%',
    marginRight: 10,
  },
  duotag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.s,
    backgroundColor: theme.colors.secondary,
    marginBottom: '-5%',
    marginRight: 10,
  },
  grouptag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.s,
    backgroundColor: '#EC5569',
    marginBottom: '-5%',
    marginRight: 10,
  },
});

export default styles;
