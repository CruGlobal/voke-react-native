import React, { useState, useEffect, useCallback } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
// import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';
import { View, ScrollView, FlatList, StatusBar, Platform } from 'react-native';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { getMyAdventure, getAdventureStepMessages, getAdventureSteps } from '../../actions/requests';
import { setCurrentScreen } from '../../actions/info';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import AdventureStepCard from '../../components/AdventureStepCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Video from '../../components/Video';
import st from '../../st';
import { TDataState } from '../../types'
import styles from './styles';
import VokeIcon from '../../components/VokeIcon';
import Touchable from '../../components/Touchable';
import Image from '../../components/Image';

type AdventureManageProps = {
  navigation: any,
  route: {
    name: string,
    params: {
      adventureId: string;
    };
  };
};

function AdventureManage({ navigation, route }: AdventureManageProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const store = useStore()
  const me = useSelector(({ auth }) => auth.user);
  const allMessages = store.getState().data.adventureStepMessages;
  const { adventureId } = route.params;
  const adventure = useSelector(({ data }: {data: TDataState}) =>
    data.myAdventures?.byId[adventureId] || {});
  const steps = useSelector(({ data }: {data: TDataState}) =>
    data.adventureSteps[adventureId], shallowEqual)  || {byId:{}, allIds: []};

  const messengers = adventure.conversation.messengers || [];
  const myUser = messengers.find(i => i.id === me.id) || {};
  const otherUser =
    messengers.find(i => i.id !== me.id && i.first_name !== 'VokeBot') || {};
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
      <ScrollView style={[st.bgBlue, st.pr4, st.pl4, { paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <Flex style={[st.mb4]} align="center" justify="center">
          <Text style={[st.white, {textAlign:'center'}]}></Text>
          <Text style={[st.white, {fontSize:21, marginTop:-6}]}>Kahlea's Middle School Group</Text>
          <Text style={[st.white, {fontSize:18, fontWeight: 'bold'}]}>Group Code: xxxxxx</Text>
        </Flex>
        <Flex style={[st.mt2]}>
          <Flex direction="row" align="end" justify="between">
          <Text style={[st.white, {fontSize:16}]}>8 Members</Text>
          <Touchable
                  isAndroidOpacity={true}
                  onPress={() =>
                    navigation.navigate('AllMembersModal', {
                      adventure: adventure,
                      isJoined: true,
                    })
                  }
                >
          <Text style={[st.darkBlue, {fontSize:16, textDecorationLine:'underline'}]}>Manage Members</Text>
          </Touchable>
          </Flex>
        <Flex direction="row" justify="between" style={{marginTop:10}}>
          <Flex direction="column" align="center" justify="center">
            <VokeIcon name="close-circle" size={44} style={{transform: [{ rotate: '45deg'}]}}/>
            <Text style={[st.white,{fontSize:12}]}>Add Member</Text>
          </Flex>
          <Touchable
                  isAndroidOpacity={true}
                  onPress={() =>
                    navigation.navigate('AllMembersModal', {
                      adventure: adventure,
                      isJoined: true,
                    })
                  }
                >
                  <Flex direction="row" align="center" style={[{paddingBottom:0}]}>
                    <Image
                      source={{
                        uri: (myUser.avatar || {}).small || undefined,
                      }}
                      style={[
                        st.circle(44),
                        { borderWidth: 2, borderColor: st.colors.white, marginLeft: -3 }
                      ]}
                    />
                    {subGroup.map((i, index) => (
                      <Image
                        source={{ uri: (i.avatar || {}).small || undefined }}
                        style={[
                          st.circle(44),
                          { borderWidth: 2, borderColor: st.colors.white, marginLeft: -12 },
                        ]}
                      />
                    ))}
                    {numberMore ? (
                      <View
                        style={[
                          st.circle(36),
                          st.abstl,
                          { left: 90 },
                          st.bgBlue,
                          { borderWidth: 1, borderColor: st.colors.white },
                        ]}
                      >
                        <Flex self="stretch" align="center" justify="center">
                        <Text style={[st.pv6, st.white, { fontSize: 16 }]}>+{numberMore}</Text>
                        </Flex>
                      </View>
                    ) :
                      <></>
                    }
                  </Flex>
                </Touchable>
        </Flex>
        </Flex>
        <Flex direction="column" justify="between" style={[st.mt2]}>
          <Text style={[st.white,{fontSize:18}]}>Member Journey Status</Text>
          <Flex direction="row">
            
          </Flex>
        </Flex>
        <Flex direction="column" justify="between" style={[st.mt2]}>
          <Text style={[st.white,{fontSize:18}]}>Reported Messages</Text>
        </Flex>
      </ScrollView>
  );
}

export default AdventureManage;
