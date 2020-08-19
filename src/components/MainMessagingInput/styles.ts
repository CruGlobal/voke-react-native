import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    borderTopColor: theme.colors.white,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginRight: 10, // TODO: add our unit.
    borderRadius: 30,
    paddingLeft: 25,
    paddingVertical: 15,
    fontSize: 16,
  },
  sendButton: {
    width: 45,
    height: 45,
    alignItems: 'flex-end',
    backgroundColor: theme.colors.secondaryAlt,
    borderColor: theme.colors.secondaryAlt,
    borderRadius: 99,
  },
  sendButtonIcon: {
    color: theme.colors.white,
    marginRight: 10,
    marginTop: 10,
  },
});

export default styles;
