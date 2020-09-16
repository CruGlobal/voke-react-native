import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  modalTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.semiBold,
    lineHeight: theme.fontSizes.xl * 1.3,
    textAlign: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
});

export default styles;
