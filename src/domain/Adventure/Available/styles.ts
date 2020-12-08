import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  iconAction: {
    paddingRight: 10,
    color: theme.colors.white,
  },
  modalTitleAction: {
    alignSelf: 'flex-end',
  },
  buttonTitleCancel: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  buttonLabelTitleCancel: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.white,
  },
});

export default styles;
