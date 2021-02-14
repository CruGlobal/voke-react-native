import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  container: {
    height: 60,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: '50%',
    borderRadius: 30,
    marginRight: -30,
    paddingHorizontal: 7,
    backgroundColor: theme.colors.accent,
  },
  badgeCount: {
    marginBottom: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  icon: {
    marginTop: 10,
    color: theme.colors.primary,
  },
  iconFocused: {
    marginTop: 10,
    color: theme.colors.white,
  },
  label: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  labelFocused: {
    fontSize: 14,
    color: theme.colors.white,
  },
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
  },
});

export default styles;
