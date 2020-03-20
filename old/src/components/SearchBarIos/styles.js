
import { StyleSheet } from 'react-native';
import theme, { COLORS }  from '../../theme';

export default StyleSheet.create({
  inputWrap: {
    height: 40,
    backgroundColor: theme.primaryColor,
    padding: 5,
  },
  searchBox: {
    width: theme.fullWidth - 20,
    height: 30,
    alignItems: 'center',
    color: theme.textColor,
    backgroundColor: COLORS.convert({ color: theme.primaryColor, darken: 0.2 }),
    borderRadius: 3,
    fontSize: 15,
    paddingLeft: 5,
  },
  searchIconWrap: {
    position: 'absolute',
    top: 10,
  },
  searchIcon: {
    color: theme.textColor,
    backgroundColor: COLORS.TRANSPARENT,
  },
});
