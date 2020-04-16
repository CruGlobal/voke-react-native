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
import theme from '../../theme';
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
import AdventuresMy from '../AdventuresMy';
import AdventuresActions from '../AdventuresActions'
import AdventuresFind from '../AdventuresFind'


function CustomTabBar(props) {
  return (
    <TabBar
      {...props}
      indicatorStyle={[st.bgWhite]}
      style={{backgroundColor: theme.colors.secondary}}
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
    my: AdventuresMy,
    find: AdventuresFind,
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
