import React from 'react';
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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

function SettingsModal(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView>
        <SettingsRow
          title="Profile"
          onSelect={() => navigation.navigate('Profile')}
        />
        <SettingsRow
          title="Create Account"
          onSelect={() =>
            navigation.navigate('CreateAccount', { shouldMerge: true })
          }
        />
        <SettingsRow
          title="Sign In"
          onSelect={() => navigation.navigate('Login', { shouldMerge: true })}
        />
        <SettingsRow
          title="Share this App"
          onSelect={() =>
            Share.share(
              {
                message:
                  "Check out this awesome app called Voke. Let's go deeper with God and others! https://vokeapp.com",
                title: 'Check out',
                url: '',
              },
              {
                dialogTitle: 'Share',
              },
            )
          }
        />
        <SettingsRow
          title="Write a Review"
          onSelect={() => {
            let link;
            if (!st.isAndroid) {
              link = CONSTANTS.IOS_STORE_LINK;
            } else {
              link = CONSTANTS.ANDROID_STORE_LINK;
            }
            if (link) {
              Linking.canOpenURL(link).then(
                isSupported => {
                  isSupported && Linking.openURL(link);
                },
                err => console.log('opening url', err),
              );
            }
          }}
        />
        <SettingsRow
          title="Follow us on Instagram"
          onSelect={() => {
            let link = CONSTANTS.WEB_URLS.INSTAGRAM;
            Linking.canOpenURL(link).then(
              isSupported => {
                isSupported && Linking.openURL(link);
              },
              err => console.log('error opening url', err),
            );
          }}
        />
        <SettingsRow
          title="Help"
          onSelect={() => navigation.navigate('Help')}
        />
        <SettingsRow
          title="Get my old conversations"
          onSelect={() => navigation.navigate('OldConversations')}
        />
        <SettingsRow
          title="About"
          onSelect={() => navigation.navigate('About')}
        />
        <SettingsRow
          title="Sign Out"
          onSelect={() => dispatch(logoutAction())}
        />
        <Flex
          direction="row"
          align="center"
          justify="start"
          style={[st.bbLightGrey, st.bbw1, st.pv5, st.ph4]}
        >
          <Text style={[st.darkGrey, st.fs16]}>Our Partners</Text>
        </Flex>
        <Flex direction="row" align="center" justify="center" wrap="wrap">
          <Image
            source={SU}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={JF}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={OH}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={YS}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={IAS}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
          <Image
            source={CRU}
            style={[st.w(st.fullWidth / 2.3), st.h(st.fullWidth / 2.3)]}
            resizeMode="contain"
          />
        </Flex>
      </ScrollView>
    </Flex>
  );
}

export default SettingsModal;
