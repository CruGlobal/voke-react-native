import React from 'react';
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Communications from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';

import CONSTANTS from '../../constants';

import CRU from '../../assets/cru.jpg';
import SU from '../../assets/scriptureUnion.png';
import JF from '../../assets/jesusFilm.png';
import IAS from '../../assets/iAmSecond.png';
import OH from '../../assets/oneHope.png';
import YS from '../../assets/youthSpecialties.png';
import { logoutAction } from '../../actions/auth';
import { useDispatch } from 'react-redux';

function SettingsRow({ title, onSelect }) {
  return (
    <Touchable onPress={onSelect}>
      <Flex
        direction="row"
        align="center"
        justify="start"
        style={[st.bbLightGrey, st.bbw1, st.pv5, st.ph4]}
      >
        <Text style={[st.darkGrey, st.fs16]}>{title}</Text>
      </Flex>
    </Touchable>
  );
}

function MenuAbout(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView>
        <SettingsRow
          title="Visit Voke Website"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.VOKE)}
        />
        <SettingsRow
          title="Follow us on Facebook"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.FACEBOOK)}
        />
        <SettingsRow
          title="Terms of Service"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
        />
        <SettingsRow
          title="Privacy Policy"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
        />
        <SettingsRow
          title="Acknowledgements"
          onSelect={() => navigation.navigate('Acknowledgements')}
        />
        <SettingsRow title={'Version ' + DeviceInfo.getReadableVersion()} />
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={[st.pv5, st.ph4, { marginTop: 30 }]}
        >
          <Text style={[st.darkGrey, st.fs14, st.ls2]}>OUR PARTNERS</Text>
        </Flex>
        <Flex
          direction="row"
          align="center"
          justify="around"
          wrap="wrap"
          style={[st.ph5]}
        >
          <Image
            source={SU}
            style={[st.w(st.fullWidth / 2), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={JF}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={OH}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 2)]}
            resizeMode="contain"
          />
          <Image
            source={YS}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 2)]}
            resizeMode="contain"
          />
          <Image
            source={IAS}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={CRU}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
        </Flex>
      </ScrollView>
    </Flex>
  );
}

export default MenuAbout;
