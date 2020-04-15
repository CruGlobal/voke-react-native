import React, { useState, useRef, forwardRef, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import StatusBar from '../../components/StatusBar';
import VokeIcon from '../../components/VokeIcon';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useMount } from '../../utils';

import st from '../../st';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction, startupAction } from '../../actions/auth';
import { ActivityIndicator, ScrollView, FlatList } from 'react-native';

import Touchable from '../../components/Touchable';
import {
  getAvailableAdventures,
  getMyAdventures,
  getAdventuresInvitations,
} from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import MyAdventureItem from '../../components/MyAdventureItem';
import Triangle from '../../components/Triangle';

function CallToActions() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const availableAdventures = useSelector(
    ({ data }) => data.availableAdventures,
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);
  return (
    <Flex direction="column" align="center" justify="center" self="stretch">
      <Touchable
        style={[
          st.bgWhite,
          st.p4,
          st.br5,
          st.mv6,
          st.mt5,
          { width: st.fullWidth - 30 },
        ]}
        onPress={
          () => navigation.navigate('EnterAdventureCode')
        }
      >
        <Flex direction="column" align="center" justify="center">
          <Text style={[st.darkBlue, st.fs18]}>Enter an Adventure Code</Text>
          <Text style={[st.fs14, st.grey]}>Did someone send you a code?</Text>
        </Flex>
      </Touchable>
      <Touchable
        style={[
          st.bgWhite,
          st.p4,
          st.br5,
          st.mv6,
          { width: st.fullWidth - 30 },
        ]}
        onPress={() =>
          navigation.navigate('NameAdventureModal', {
            item: adventures.find(a => a.name === 'The Faith Adventure'),
            withGroup: true,
          })
        }
      >
        <Flex direction="row" align="center" justify="between" style={[st.ph4]}>
          <VokeIcon
            type="image"
            name="groupDark"
            style={[st.w(40), st.h(40)]}
          />
          <Flex direction="column" align="center" justify="center">
            <Text style={[st.darkBlue, st.fs18]}>Start a Group</Text>
            <Text style={[st.fs14, st.grey]}>
              Do The Faith Adventure together!
            </Text>
          </Flex>
          <VokeIcon
            type="image"
            name="buttonArrowDark"
            style={[st.w(20), st.h(20)]}
          />
        </Flex>
      </Touchable>
    </Flex>
  );
}

function MyAdventures() {
  const myAdventures = useSelector(({ data }) => data.myAdventures);
  const me = useSelector(({ auth }) => auth.user);
  const adventureInvitations = useSelector(
    ({ data }) => data.adventureInvitations,
  );
  const [combinedData, setCombinedData] = useState(
    [].concat(adventureInvitations, myAdventures),
  );
  const dispatch = useDispatch();

  // Actions to run when component mounted.
  useMount(() => {
    dispatch(startupAction());
    // dispatch({ type: REDUX_ACTIONS.RESET });
    // if (myAdventures.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    dispatch(getMyAdventures());
    // }
    // if (adventureInvitations.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    dispatch(getAdventuresInvitations());
    // }
  });

  useEffect(() => {
    setCombinedData([].concat(adventureInvitations, myAdventures));
  }, [myAdventures, adventureInvitations]);

  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <CallToActions />
      <FlatList
        renderItem={props => <MyAdventureItem {...props} />}
        data={combinedData}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.mh4, st.mt1, st.h(230)]}
          >
            <Flex justify="end" self="stretch" style={[]}>
              <VokeIcon
                type="image"
                name="vokebot"
                style={[
                  st.asc,
                  st.w(st.fullWidth * 0.2),
                  { marginBottom: -35, marginRight: -20 },
                ]}
              />
            </Flex>
            <Flex direction="column" value={1} justify="start" style={[st.pr3]}>
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                <Text style={[st.white, st.fs18, st.tac]}>
                  {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
                </Text>
              </Flex>
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                slant="down"
                flip={true}
                style={[st.rotate(90), st.mt(-6)]}
              />
            </Flex>
          </Flex>
        )}
      />
    </ScrollView>
  );
}

function FindAdventures() {
  const availableAdventures = useSelector(
    ({ data }) => data.availableAdventures,
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  const dispatch = useDispatch();
  useMount(() => {
    if (availableAdventures.length === 0) {
      dispatch(getAvailableAdventures());
    }
  });
  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);
  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <CallToActions />
      <FlatList
        renderItem={props => <AvailableAdventureItem {...props} />}
        data={adventures}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews={true}
      />
    </ScrollView>
  );
}

function CustomTabBar(props) {
  return (
    <TabBar
      {...props}
      indicatorStyle={[st.bgWhite]}
      style={[st.bgDarkBlue]}
      activeColor={st.colors.white}
      inactiveColor={st.colors.blue}
      renderLabel={({ route, focused, color }) => (
        <Text style={[{ color }, st.fs16, st.fontFamilyMain, st.pv5]}>
          {route.title}
        </Text>
      )}
    />
  );
}

function Adventures(props) {
  console.log( "📟Container > Adventures" );
  const [index, setIndex] = React.useState(0);

  useMount(() => {
    Orientation.lockToPortrait();
  });

  const [routes] = React.useState([
    { key: 'my', title: 'My Adventures' },
    { key: 'find', title: 'Find Adventures' },
  ]);

  const renderScene = SceneMap({
    my: MyAdventures,
    find: FindAdventures,
  });
  return (
    <>
      <StatusBar />
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: st.fullWidth }}
          renderTabBar={props => <CustomTabBar {...props} />}
        />
      </Flex>
    </>
  );
}

export default Adventures;
