import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  AdventureActions: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  AdventureActionsBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    opacity: 0.93,
  },
  AdventureActionsContent: {
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    flex: 1,
    width: '100%',
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
