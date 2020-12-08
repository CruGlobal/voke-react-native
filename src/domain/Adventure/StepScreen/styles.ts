import { StyleSheet } from 'react-native';
import theme from 'utils/theme';
const THUMBNAIL_WIDTH = 140;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'flex-start',
  },
  wrapper: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 0,
  },
  scrollContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    right: -30,
    height: 25,
    width: 25,
    borderRadius: 50,
  },

  botIntroBanner: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    overflow: 'hidden',
  },
  botIntroBannerText: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.white,
    paddingHorizontal: theme.spacing.l,
    textAlign: 'center',
  },
  vokebot: {
    position: 'absolute',
    left: -25,
    bottom: -20,
    width: 76,
    height: 76,
    color: theme.colors.white,
  },

  sceletonQuestion: {
    paddingTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.l + 20,
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
