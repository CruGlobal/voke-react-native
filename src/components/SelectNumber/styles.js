
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
    width: theme.fullWidth - 50,
    borderRadius: 6,
    marginVertical: 4,
  },
  modal2: {
    backgroundColor: theme.white,
    width: theme.fullWidth - 50,
    borderRadius: 6,
    marginVertical: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: COLORS.DARK_GREY,
    paddingRight: 10,
  },
  cancelWrap: {
    padding: 5,
  },
  number: {
    fontSize: 16,
    color: COLORS.LIGHT_GREY,
  },
  cancelButtonText: {
    fontSize: 18,
    color: 'rgb(72, 164, 231)',
    fontWeight: 'bold',
  },
  cancelButton: {
    width: theme.fullWidth - 60,
    alignItems: 'center',
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
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
});
