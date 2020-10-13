import React, { useMemo } from 'react';
import { Alert, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Communications from 'react-native-communications';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import Button from '../../components/Button';
import VokeIcon from '../../components/VokeIcon';
import Image from '../../components/Image';
import { resendAdventureInvitation } from '../../actions/requests';
import { getExpiredTime } from '../../utils/get';

import styles from './styles';

const ManageMembers = ({ messengers, me, adventure }) => {
  const { t } = useTranslation('manageGroup');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const myUser = messengers.find(i => i.id === me.id) || {};
  const myAvatar = useMemo(() => myUser?.avatar?.small, [
    myUser?.avatar?.small,
  ]);
  const inviteId = adventure?.journey_invite?.id;
  const inviteItem = useSelector(
    ({ data }) => data.adventureInvitations.byId[inviteId],
  );

  const otherUsers =
    messengers.filter(i => i.id !== me.id && i.first_name !== 'VokeBot') || [];

  const totalGroupUsers = otherUsers.length;
  let subGroup = otherUsers;
  let numberMore = 0;
  if (totalGroupUsers > 7) {
    subGroup = otherUsers.slice(0, 6);
    numberMore = totalGroupUsers - 7;
  }

  const addMembers = async (inviteItem): void => {
    try {
      /* Before we show a screen with invite code,
      check if it's expired.
      Renew invite on the server if it is expired.
      Otherwise go ahead and show a screen with a share code. */
      const { isTimeExpired } = getExpiredTime(inviteItem.expires_at);
      let readyToShare = true;
      if (isTimeExpired) {
        readyToShare = false;
        const result = await dispatch(resendAdventureInvitation(inviteItem.id));
        if (!result.error) {
          readyToShare = true;
        } else {
          throw false;
        }
      }

      if (readyToShare) {
        navigation.navigate('AdventureShareCode', {
          invitation: inviteItem,
          withGroup: true,
          isVideoInvite: false,
        });
      }
    } catch (error) {
      Alert.alert(
        'Failed to send a new invite',
        'Please, check your internet connection and try again.',
        [
          {
            text: t('settings:email'),
            onPress: () => {
              Communications.email(
                ['support@vokeapp.com'], // TO
                null, // CC
                null, // BCC
                'Voke App Error: Failed to send a new invite', // SUBJECT
                `I'm getting 'Failed to send a new invite' error when inviting more members into my group.
                My account email is: ...
                Group invite code is: ... `, // BODY
              );
            },
          },
          {
            text: t('ok'),
            onPress: () => {},
          },
        ],
      );
    }
  };

  return (
    <View style={styles.members}>
      <Flex
        direction="row"
        align="center"
        justify="between"
        style={styles.membersMain}
      >
        <Text style={styles.membersCount}>
          {otherUsers.length ? otherUsers.length + ' ' : ''}
          {otherUsers.length
            ? t('members', { count: otherUsers.length })
            : t('noMembers')}
        </Text>
        <Touchable
          isAndroidOpacity={true}
          onPress={(): void =>
            navigation.navigate('AllMembersModal', {
              adventure: adventure,
              isJoined: true,
            })
          }
        >
          <Text style={styles.manageMembers}>{t('manageMembers')}</Text>
        </Touchable>
      </Flex>
      {otherUsers.length ? (
        <View style={styles.membersList}>
          <Button
            onPress={(): void => {
              addMembers(inviteItem);
            }}
            style={styles.membersAddButtonAlt}
          >
            <View style={styles.membersAddButtonAltIconBlock}>
              <VokeIcon
                name={'plus'}
                size={20}
                style={styles.membersAddButtonAltIcon}
              />
            </View>
            <Text style={styles.membersAddButtonAltLabel}>
              {t('addMembers')}
            </Text>
          </Button>
          <Touchable
            isAndroidOpacity={true}
            onPress={(): void =>
              navigation.navigate('AllMembersModal', {
                adventure: adventure,
                isJoined: true,
              })
            }
          >
            <Flex align="center" style={styles.memberAvatars}>
              {/* Rendered backwards to make a stack look natural */}
              {numberMore ? (
                <View style={styles.pseudoAvatar}>
                  <Text style={styles.pseudoAvatarNum}>+{numberMore}</Text>
                </View>
              ) : (
                <></>
              )}
              {subGroup.map((i, index) => (
                <Image uri={i?.avatar?.small} style={styles.avatarInGroup} />
              ))}
              <Image uri={myAvatar} style={styles.avatar} />
            </Flex>
          </Touchable>
        </View>
      ) : (
        <View style={styles.membersAdd}>
          <Text style={styles.membersAddText}>{t('noMembersYet')}</Text>
          <Button
            onPress={(): void => {
              addMembers(inviteItem);
            }}
            style={styles.membersAddButton}
          >
            <Text style={styles.membersAddButtonLabel}>{t('addMembers')}</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default ManageMembers;
