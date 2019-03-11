import { StyleSheet } from 'react-native';
import theme from '../../theme';

export default StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginVertical: 6,
    height: 200,
    shadowOpacity: 0.35,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: theme.black,
    shadowRadius: 1,
    elevation: 5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
  },
  image: {},
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  slogan: {
    fontSize: 24,
    fontWeight: '300',
  },
});
