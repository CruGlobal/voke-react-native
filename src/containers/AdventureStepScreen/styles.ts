import { StyleSheet } from 'react-native';

import theme from '../../theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  vokebot: {
    position: 'absolute',
    left:-25,
    bottom:-20,
    width:70,
    height:70,
    color: theme.colors.white,
  },
  avatar: {
    position: 'absolute',
    right: -30,
    height: 25,
    width: 25,
    borderRadius: 50,
  },


  mainQuestionCard: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  mainQuestionContainer: {
    paddingHorizontal: 20,
  },
  mainQuestion: {
    backgroundColor: theme.colors.accent,
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  mainQuestionText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.xl,
    lineHeight: theme.fontSizes.xl * 1.3,
    textAlign: 'center',
  },
});

export default styles;
