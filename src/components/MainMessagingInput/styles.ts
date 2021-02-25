import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.m,
    borderTopColor: theme.colors.white,
    borderTopWidth: 1,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginRight: 10, // TODO: add our unit.
    borderRadius: 30,
    paddingLeft: 25,
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 27,
    minHeight: 45,
    maxHeight: 145,
  },
  sendButton: {
    width: 45,
    height: 45,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondaryAlt,
    borderColor: theme.colors.secondaryAlt,
    borderRadius: 99,
  },
  sendButtonIcon: {
    color: theme.colors.white,
  },
});

export default styles;
