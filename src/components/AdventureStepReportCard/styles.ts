import { StyleSheet } from 'react-native';

import theme from '../../theme';

const stylesShared = {
  card: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.radius.m,
    // marginBottom: theme.spacing.s,
  },
};

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.spacing.s,
  },
  card: {
    ...stylesShared.card,
    backgroundColor: theme.colors.lightGrey,
  },
  cardLocked: {
    ...stylesShared.card,
    backgroundColor: theme.colors.secondaryAlt,
  },
  cardNext: {
    ...stylesShared.card,
    backgroundColor: theme.colors.white,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
  },
  cardSubTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.s,
  },
  action: {
    alignSelf: 'center',
  },
  actionText: {
    color: theme.colors.secondary,
    textDecorationLine: 'underline',
  },
  actionLocked: {
    color: theme.colors.white,
  },
  actionReleaseNow: {
    borderRadius: theme.radius.s,
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
  },
  actionReleaseNowLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.m,
    fontFamily: theme.fonts.semiBold,
  },
  stepMembers: {
    // paddingVertical: theme.spacing.l,
    // paddingHorizontal: theme.spacing.l,
  },
  modalTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.xl,
    textAlign: 'center',
  },
  modalSubTitle: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
    textAlign: 'center',
  },
  stepMembersHeader: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  stepMemberItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.lightGrey,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    marginBottom: 1,
    alignItems: 'center',
  },
  stepMemberItemText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
    paddingLeft: theme.spacing.s,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: theme.colors.white,
  }
});

export default styles;
