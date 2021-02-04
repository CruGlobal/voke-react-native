import { StyleSheet } from 'react-native';
import theme from 'utils/theme';

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    height: 90,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  actionsPanel: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    width: '100%',
    height: '100%',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
});

export default styles;
