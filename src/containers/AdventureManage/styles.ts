import { StyleSheet } from 'react-native';

import theme from '../../theme';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.primary,
  },
  header: {
    paddingTop: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },
  invite: {
    paddingTop: theme.spacing.s,
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  inviteCode: {
    color: theme.colors.white,
    fontFamily: theme.fonts.semiBold,
  },
  releaseSchedule: {
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
    // textAlign: 'center',
  },
  releaseScheduleText: {
    color: theme.colors.white,
    // textAlign: 'center',
  },
  members: {
    paddingTop: theme.spacing.l,
  },
  membersMain: {
    paddingBottom: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
  },
  membersCount: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  sectionTitle: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  manageMembers: {
    color: theme.colors.secondary,
    textDecorationLine: 'underline',
  },
  membersAdd: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.secondaryAlt,
    paddingHorizontal: theme.spacing.l,
    alignItems: 'center',
  },
  membersAddText: {
    color: theme.colors.white,
    flex: 1,
    paddingRight: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  membersAddButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xs,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,

    /* shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 4,
    shadowRadius: 5,
    shadowOffset: { width: 1, height: 2 },
     */
  },
  membersAddButtonLabel: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.s,
    fontFamily: theme.fonts.semiBold,
    textAlign: 'center',
  },
  membersList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.l,
  },
  membersAddButtonAlt: {
    alignItems: 'center',
  },
  membersAddButtonAltIconBlock: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xxl,
    width:42,
    height:42,
    justifyContent: 'center',
  },
  membersAddButtonAltIcon: {
    textAlign: 'center',
    color: theme.colors.primary,
  },
  membersAddButtonAltLabel: {
    fontSize: theme.fontSizes.s,
    textAlign: 'center',
    color: theme.colors.white,
    paddingTop: theme.spacing.xs,
  },
  memberAvatars: {
    alignItems: 'flex-end',
  },
  avatars: {
    width: '100%',
    paddingBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -3,
    zIndex:1,
  },
  avatarInGroup: {
    // avatar
    width: 42,
    height: 42,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: '#fff',

    marginLeft: -10,
  },
  stepsContainer: {
    paddingTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  complains: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  complainsBlock: {
    minHeight: 140,
  },
  complainsEmpty: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.secondaryAlt,
  },
  footer: {
    paddingVertical: theme.spacing.l,
    paddingHorizontal: theme.spacing.l,
  },
  groupDelete: {
    fontSize: theme.fontSizes.l,
    color: theme.colors.red,
  },
  startedDate: {
    fontSize: theme.fontSizes.m,
    color: theme.colors.secondary,
  },
  reportedMessageSecondary: {
    backgroundColor:'blue',
  }
  /* modalTitleArea: {
    paddingBottom: theme.spacing.s,
    flexDirection: 'row',
  }, */
});

export default styles;
