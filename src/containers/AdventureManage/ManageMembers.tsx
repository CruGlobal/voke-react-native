import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import Button from '../../components/Button';
import VokeIcon from '../../components/VokeIcon';
import Image from '../../components/Image';

import styles from './styles';

const ManageMembers = ({ messengers, me }) => {
  const { t } = useTranslation('manageGroup');
  const myUser = messengers.find(i => i.id === me.id) || {};
  const myAvatar = useMemo(() => myUser?.avatar?.small, [
    myUser?.avatar?.small,
  ]);
  const otherUsers =
    messengers.filter(i => i.id !== me.id && i.first_name !== 'VokeBot') || {};
  const usersExceptVokeAndMe = messengers.filter(
    i => i.id !== me.id && i.first_name !== 'VokeBot',
  );
  const totalGroupUsers = usersExceptVokeAndMe.length;
  let subGroup = usersExceptVokeAndMe;
  let numberMore = 0;
  if (totalGroupUsers > 7) {
    subGroup = usersExceptVokeAndMe.slice(0, 6);
    numberMore = totalGroupUsers - 7;
  }
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
              navigation.navigate('AdventureShareCode', {
                invitation: inviteItem,
                withGroup: true,
                isVideoInvite: false,
              });
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
                adventure: adventureItem,
                isJoined: true,
              })
            }
          >
            <Flex direction="row" align="center" style={styles.memberAvatars}>
              <Image uri={myAvatar} style={styles.avatar} />
              {subGroup.map((i, index) => (
                <Image uri={i?.avatar?.small} style={styles.avatarInGroup} />
              ))}
              {numberMore ? (
                <View
                  style={[
                    st.circle(36),
                    st.bgBlue,
                    {
                      borderWidth: 2,
                      borderColor: st.colors.white,
                      marginLeft: -14,
                    },
                  ]}
                >
                  <Flex self="stretch" align="center" justify="center">
                    <Text
                      style={[
                        st.white,
                        {
                          fontSize: 16,
                          height: '100%',
                          lineHeight: 29,
                        },
                      ]}
                    >
                      +{numberMore}
                    </Text>
                  </Flex>
                </View>
              ) : (
                <></>
              )}
            </Flex>
          </Touchable>
        </View>
      ) : (
        <View style={styles.membersAdd}>
          <Text style={styles.membersAddText}>{t('noMembersYet')}</Text>
          <Button
            onPress={(): void => {
              navigation.navigate('AdventureShareCode', {
                invitation: inviteItem,
                withGroup: true,
                isVideoInvite: false,
              });
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
