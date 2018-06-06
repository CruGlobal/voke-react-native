
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';
import videoUtils from '../../utils/video';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modal: {
    padding: 50,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  video: {
    backgroundColor: COLORS.DEEP_BLACK,
    height: videoUtils.HEIGHT,
    width: videoUtils.WIDTH - 50,
    marginTop: 20,
  },
  title: {
    color: theme.primaryColor,
    fontSize: 28,
    marginVertical: 20,
    lineHeight: 32,
  },
  icon: {
    marginTop: 20,
  },
  buttonText: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: '400',
  },
  button: {
    borderColor: theme.primaryColor,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonWrapper: {
    padding: 5,
  },
  description: {
    fontSize: 16,
    color: theme.white,
  },
  completeButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.GREEN,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    minWidth: 200,
  },
  acceptButton: {
    borderColor: theme.primaryColor,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 20,
  },
  acceptButtonInactive: {
    borderColor: theme.primaryColor,
    minWidth: 200,
    alignItems: 'center',
    marginVertical: 20,
    opacity: 0.4,
  },
  inactiveCompleteButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.GREEN,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 200,
    opacity: 0.4,
  },
  completeButtonText: {
    fontSize: 16,
    color: COLORS.GREEN,
  },
  buttonActiveText: {
    fontSize: 16,
  },
});
