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
    backgroundColor: theme.colors.lightGrey,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  stepMemberItemText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.l,
  }
  /* buttonSend: {
    padding: 20,
    right: -15,
  }, */
});

export default styles;
