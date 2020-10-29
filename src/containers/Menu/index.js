import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Linking, Alert } from 'react-native';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';

import CONSTANTS from '../../constants';

import CRU from '../../assets/cru.png';
import SU from '../../assets/scriptureUnion.png';
import JF from '../../assets/jesusFilm.png';
import IAS from '../../assets/iAmSecond.png';
import OH from '../../assets/oneHope.png';
import YS from '../../assets/youthSpecialties.png';
import { logoutAction } from '../../actions/auth';

function SettingsRow({ title, onSelect, testID }) {
  return (
    <Touchable onPress={onSelect} testID={testID}>
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
  const { t, i18n } = useTranslation('share');

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
          title={t('title:profile')}
          onSelect={() => navigation.navigate('AccountProfile')}
          testID={'menuProfile'}
        />
        {!email && (
          <SettingsRow
            title={t('createAccount')}
            onSelect={() =>
              navigation.navigate('AccountCreate', { shouldMerge: true })
            }
            testID={'menuCreateAccount'}
          />
        )}
        {!email && (
          <SettingsRow
            title={t('signIn')}
            onSelect={() =>
              navigation.navigate('AccountSignIn', { shouldMerge: true })
            }
          />
        )}
        <SettingsRow
          title={t('shareApp')}
          onSelect={() =>
            Share.open(
              {
                subject: t('checkTitle'),
                title: t('checkTitle'),
                message: t('checkMessage'),
                url: 'https://voke.page.link/app', // At least one of URL and message is required.
              }
              /* ,
              {
                dialogTitle: 'Share',
              }, */
            )
          }
        />
        <SettingsRow
          title={t('writeReview')}
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
          title={t('followInstagram')}
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
          title={t('title:help')}
          onSelect={() => navigation.navigate('Help')}
        />
        <SettingsRow
          title={t('title:about')}
          onSelect={() => navigation.navigate('About')}
        />
        {!!email && (<SettingsRow
          title={t('signOut')}
          onSelect={() => {
            !email && Alert.alert(
              t('deleteSure'),
              t('deleteDescription'),
              [
                {
                  text: t('confirm'),
                  onPress: () => {
                    return signOut()
                  },
                },
                {
                  text: t('cancel'),
                  onPress: () => {
                    return
                  },
                  style: "cancel"
                }
              ]
            );
            email && signOut();
          }}
        />)}
        {/* SECTION: OUR PARTNERS */}
        {/* TODO: Tidy up */}
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={[st.pv5, st.ph4, { marginTop: 30 }]}
        >
          <Text style={[st.darkGrey, st.fs14, st.ls2]}>{t('ourPartners').toUpperCase()}</Text>
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
