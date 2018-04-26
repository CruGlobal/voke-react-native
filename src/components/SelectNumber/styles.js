
import { StyleSheet } from 'react-native';
import theme, { COLORS } from '../../theme';


export default StyleSheet.create({
  selectNumModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    backgroundColor: theme.white,
    width: theme.fullWidth - 100,
    borderRadius: 6,
  },
  label: {
    fontSize: 14,
    color: theme.primaryColor,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  number: {
    fontSize: 14,
    color: theme.black,
  },
  nameText: {
    fontSize: 18,
    color: theme.black,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  rowWrap: {
    borderBottomWidth: 1,
    borderBottomColor: theme.separatorColor,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
});
