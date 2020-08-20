import { StyleSheet } from 'react-native';

import theme from '../../theme';
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
    right: 2,
    top: 4,
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
  avatarSolo: {
    marginLeft: -12
  },
  solotag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    padding: theme.spacing.xxs,
    backgroundColor: theme.colors.secondaryAlt,
    marginBottom: '-5%',
    marginRight: 10,
  },
  duotag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    padding: theme.spacing.xxs,
    backgroundColor: theme.colors.secondary,
    marginBottom: '-5%',
    marginRight: 10,
  },
  grouptag: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.s,
    padding: theme.spacing.xxs,
    backgroundColor: '#EC5569',
    marginBottom: '-5%',
    marginRight: 10,
  },
});

export default styles;
