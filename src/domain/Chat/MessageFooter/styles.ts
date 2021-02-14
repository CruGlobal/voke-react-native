import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  messageMeta: {
    paddingTop: theme.spacing.xs,
    flexDirection: 'row',
  },
  date: {
    textAlign: 'right',
    fontSize: theme.fontSizes.xs,
    color: theme.colors.white,
  },
});

export default styles;
