import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Image from 'components/Image';
import Triangle from 'components/Triangle';
import OldButton from 'components/OldButton';
import Touchable from 'components/Touchable';
import VokeIcon from 'components/VokeIcon';
import theme from 'utils/theme';
import st from 'utils/st';
import {
  AdventureStackParamList,
  TAdventureSingle,
  TDataState,
  TMessenger,
} from 'utils/types';
import { RootState } from 'reducers';

import styles from './styles';

type NavigationPropType = StackNavigationProp<
  AdventureStackParamList,
  'GroupModal'
>;

type RoutePropType = RouteProp<AdventureStackParamList, 'GroupModal'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function GroupModal(props: Props): ReactElement {
  const smallCircle = st.fullWidth / 2 - 90;
  const smallBox = st.fullWidth / 2 - 50;
  const largeCircle = st.fullWidth / 2 - 80;
  const largeBox = st.fullWidth / 2 - 30;

  const { adventureId } = props.route.params;
  const { t } = useTranslation();
  const navigation = useNavigation();
  const me = useSelector(({ auth }: RootState) => auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [messengers, setMessengers] = useState<TMessenger[] | []>([]);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>();
  // We update local adventures in the background when accepting invite.
  // If no adventures in the local store at this point - we have a problem.
  const adventure: TAdventureSingle = useSelector(
    ({ data }: RootState) =>
      data.myAdventures?.byId[
        adventureId as keyof TDataState['myAdventures']['byId']
      ] || {},
  );

  useEffect(() => {
    if (adventure?.id) {
      const allMessengers = adventure?.conversation?.messengers;
      if (allMessengers.length) {
        // setAllMessengers(allMessengers.slice());
        const humanMessengers = allMessengers.filter(
          i =>
            i.first_name !== 'VokeBot' &&
            (i || {}).id !== (me || {}).id &&
            i['archived?'] !== true &&
            i['blocked?'] !== true,
        );
        // Fake crowd.
        if (humanMessengers.length < 5) {
          for (let m = 0; humanMessengers.length < 5; m++) {
            humanMessengers.push({
              id: 'fake',
              first_name: '',
              last_name: '',
              avatar: {
                small: '',
                medium: '',
                large: '',
              },
            });
          }
        }
        setMessengers(humanMessengers.slice());
        setIsLoading(false);
      }
    }
  }, [adventure?.conversation?.messengers, adventure?.id, me]);

  useEffect(() => {
    if (isLoading && !redirectTimerRef.current) {
      redirectTimerRef.current = setTimeout(() => {
        // Backup plan: Redirect to My Adventures screen if nothing happen in 5sec.
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoggedInApp' }],
        });
      }, 5000);
    } else if (!isLoading && redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  }, [isLoading, navigation]);

  const handleJoinGroup = (): void => {
    // Go to the adventure steps screen.
    navigation.navigate('AdventureActive', {
      adventureId: adventureId,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <>
        {isLoading ? (
          <View style={{ position: 'absolute', alignSelf: 'center' }}>
            <ActivityIndicator size="small" color="#216373" />
          </View>
        ) : (
          <>
            <Flex style={{ marginBottom: 15 }}>
              <Flex align="center" justify="center" style={styles.title}>
                <Flex>
                  <Text
                    style={[
                      st.white,
                      st.fs16,
                      st.tac,
                      { marginBottom: theme.spacing.s },
                    ]}
                  >
                    {t('modal:welcomeTo')}
                    {adventure.journey_invite?.name || adventure.name || ''}!
                  </Text>
                </Flex>
                <Flex
                  align="start"
                  justify="start"
                  style={[st.w(st.fullWidth - 100)]}
                >
                  <Triangle
                    width={20}
                    height={15}
                    color={st.colors.offBlue}
                    slant="down"
                    flip={true}
                    style={{
                      transform: [{ rotate: '90deg' }],
                      marginTop: -6,
                    }}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Flex align="center" justify="center" style={[]}>
              <Flex
                direction="row"
                wrap="wrap"
                align="end"
                justify="end"
                style={[st.w(st.fullWidth - 20)]}
              >
                {messengers.slice(0, 5).map((messenger, index) => (
                  <Flex
                    key={messenger.id}
                    direction="column"
                    align="center"
                    justify="center"
                    style={{
                      backgroundColor: theme.colors.secondaryAlt,
                      width: index === 0 ? largeBox : smallBox,
                      height: index === 0 ? largeBox : smallBox,
                      margin: 10,
                      marginRight: 15,
                      paddingVertical: theme.spacing.l,
                    }}
                  >

                    {!messenger?.avatar?.medium ? (
                      <Flex align="center" justify="center" style={{ paddingTop: 25 }}>
                        <VokeIcon name="person" size={80} style={[st.white]} />
                      </Flex>
                    ) : (
                      <Image
                        resizeMode="contain"
                        source={{ uri: messenger.avatar.medium }}
                        style={[
                          {
                            height: index === 0 ? largeCircle : smallCircle,
                            width: index === 0 ? largeCircle : smallCircle,
                            borderRadius:
                              index === 0 ? largeCircle / 2 : smallCircle / 2,
                            borderWidth: 2,
                            borderColor: st.colors.white,
                          },
                        ]}
                      />
                    )}

                    <Text
                      style={{
                        fontSize: theme.fontSizes.l,
                        paddingTop: 3,
                        color: theme.colors.white,
                        textAlign: 'center',
                      }}
                      numberOfLines={1}
                    >
                      {messenger.first_name}
                    </Text>
                  </Flex>
                ))}
                <Flex
                  direction="column"
                  align="center"
                  style={{
                    margin: 10,
                    width: smallBox,
                    height: smallBox,
                    backgroundColor: theme.colors.accent,
                  }}
                >
                  <Touchable
                    onPress={(): void => handleJoinGroup()}
                    style={{
                      flex: 1,
                      width: '100%',
                      padding: theme.spacing.s,
                    }}
                    testID="ctaJoinGroup"
                  >
                    <>
                      <Flex
                        value={1}
                        justify="end"
                        style={{
                          paddingBottom: theme.spacing.s,
                          paddingLeft: theme.spacing.s,
                        }}
                      >
                        <Image
                          resizeMode="contain"
                          source={{ uri: me?.avatar?.large }}
                          style={[
                            {
                              height: smallBox / 2.5,
                              width: smallBox / 2.5,
                              borderRadius: 100,
                            },
                          ]}
                        />
                      </Flex>
                      <Flex
                        direction="row"
                        align="center"
                        justify="between"
                        value={1}
                        self="stretch"
                      >
                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Text
                            style={[
                              st.white,
                              st.tal,
                              {
                                paddingLeft: theme.spacing.s,
                                fontSize: st.isAndroid
                                  ? theme.fontSizes.m
                                  : theme.fontSizes.xl,
                                lineHeight: st.isAndroid
                                  ? theme.fontSizes.l
                                  : theme.fontSizes.xxl,
                              },
                            ]}
                          >
                            {t('joinGroup')}
                          </Text>
                        </View>
                        <VokeIcon
                          name="arrow-left2"
                          size={30}
                          style={{
                            transform: [{ rotate: '180deg' }],
                            color: theme.colors.white,
                          }}
                        />
                      </Flex>
                    </>
                  </Touchable>
                </Flex>
              </Flex>
            </Flex>
            {messengers.length > 0 ? (
              <Flex align="center" self="stretch">
                <OldButton
                  onPress={(): void =>
                    navigation.navigate('AllMembersModal', {
                      adventureId: adventure.id,
                      isJoined: false,
                    })
                  }
                  style={{
                    alignItems: 'center',
                    width: st.fullWidth - 90,
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    marginTop: theme.spacing.l,
                    borderRadius: theme.radius.xxl,
                    backgroundColor: theme.colors.accent,
                  }}
                >
                  <Flex direction="row" align="center">
                    <Text style={[st.white, st.fs16]}>{t('allMembers')}</Text>
                  </Flex>
                </OldButton>
              </Flex>
            ) : null}
          </>
        )}
      </>
    </ScrollView>
  );
}

export default GroupModal;
