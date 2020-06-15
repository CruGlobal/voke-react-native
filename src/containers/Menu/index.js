import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';

import CONSTANTS from '../../constants';

import CRU from '../../assets/cru.jpg';
import SU from '../../assets/scriptureUnion.png';
import JF from '../../assets/jesusFilm.png';
import IAS from '../../assets/iAmSecond.png';
import OH from '../../assets/oneHope.png';
import YS from '../../assets/youthSpecialties.png';
import { logoutAction } from '../../actions/auth';

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

function Menu(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const email = useSelector(({ auth }: any) => auth?.user?.email);
  const { t, i18n } = useTranslation('shareFlow');

  const signOut = () => {
    dispatch(logoutAction()).then(() => {
      // Navigate back to the very first screen.
      // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
      setTimeout(() => {
        navigation.reset({
          index: 1,
          routes: [{ name: 'Welcome' }],
        });
      }, 10);
    });
  }

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView>
        <SettingsRow
          title="Profile"
          onSelect={() => navigation.navigate('AccountProfile')}
        />
        {!email && (
          <SettingsRow
            title="Create Account"
            onSelect={() =>
              navigation.navigate('AccountCreate', { shouldMerge: true })
            }
          />
        )}
        {!email && (
          <SettingsRow
            title="Sign In"
            onSelect={() =>
              navigation.navigate('AccountSignIn', { shouldMerge: true })
            }
          />
        )}
        <SettingsRow
          title="Share this App"
          onSelect={() =>
            Share.share(
              {
                subject: t('checkTitle'),
                title: t('checkTitle'),
                message: t('checkMessage'),
                url: 'https://voke.page.link/app', // At least one of URL and message is required.
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
            const link = CONSTANTS.WEB_URLS.INSTAGRAM;
            Linking.canOpenURL(link).then(
              isSupported => {
                isSupported && Linking.openURL(link);
              },
              err => console.log('error opening url', err),
            );
          }}
        />
        <SettingsRow
          title="Get Help"
          onSelect={() => navigation.navigate('Help')}
        />
        <SettingsRow
          title="About"
          onSelect={() => navigation.navigate('About')}
        />
        <SettingsRow
          title="Sign Out"
          onSelect={() => {
            !email && Alert.alert(
              'Are you sure?',
              'You are about to remove your guest account - which will delete all conversations, progress and user data.',
              [
                {
                  text: 'Confirm',
                  onPress: () => {
                    return signOut()
                  },
                },
                {
                  text: 'Cancel',
                  onPress: () => {
                    return
                  },
                  style: "cancel"
                }
              ]
            );
            email && signOut();
          }}
        />
        {/* SECTION: OUR PARTNERS */}
        {/* TODO: Tidy up */}
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
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={JF}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={OH}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={YS}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={IAS}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
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

export default Menu;
