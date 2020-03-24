import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { sum } from '../../utils';

import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import {
  logoutAction,
  loginAction,
  login,
  register,
  passwordReset,
  getMe,
} from '../../actions/auth';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  ScrollView,
  Animated,
} from 'react-native';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';

function CallToActions() {
  const dispatch = useDispatch();
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
        onPress={() => dispatch(logoutAction())}
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
        onPress={() => dispatch(getMe())}
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
  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <CallToActions />
      <Text>HERHER</Text>
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
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState(false);
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'my', title: 'My Adventures' },
    { key: 'find', title: 'Find Adventures' },
  ]);

  const renderScene = SceneMap({
    my: MyAdventures,
    find: MyAdventures,
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
