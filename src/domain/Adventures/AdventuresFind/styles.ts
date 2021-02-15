import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  AdventureActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
  },
  haveCode: {
    paddingVertical: theme.spacing.m * 1.25,
  },
  haveCodeLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
    textDecorationLine: 'underline',
  },
});

export default styles;
