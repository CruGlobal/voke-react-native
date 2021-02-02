import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  optionWrapper: {
    width: '100%',
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,.15)',
  },
  optionRow: {
    flex: 1,
    paddingLeft: theme.spacing.s,
  },
  optionCheck: {
    paddingHorizontal: theme.spacing.s,
  },
  optionLabelDefault: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondary,
  },
  optionLabelSelected: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.orange,
  },

  optionCheckDefault: {
    color: theme.colors.grey,
    opacity: 0,
  },
  optionCheckSelected: {
    color: theme.colors.orange,
  },
});

export default styles;
