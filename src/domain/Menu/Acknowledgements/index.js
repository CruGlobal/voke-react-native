import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Communications from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import Flex from 'components/Flex';
import Image from 'components/Image';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import CRU from 'src/assets/cru.png';
import SU from 'src/assets/scriptureUnion.png';
import JF from 'src/assets/jesusFilm.png';
import IAS from 'src/assets/iAmSecond.png';
import OH from 'src/assets/oneHope.png';
import YS from 'src/assets/youthSpecialties.png';
import CONSTANTS from 'utils/constants';
import st from 'utils/st';

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

function MenuAcknowledgements() {
  const insets = useSafeArea();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <SettingsRow
          title="Firebase"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.FIREBASE)}
        />
        <SettingsRow
          title="React Native"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE)}
        />
        <SettingsRow
          title="react-native-animatable"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_ANIMATABLE)
          }
        />
        <SettingsRow
          title="react-native-communications"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_COMMUNICATIONS)
          }
        />
        <SettingsRow
          title="react-native-contacts"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_CONTACTS)
          }
        />
        <SettingsRow
          title="react-native-device-info"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_DEVICE_INFO)
          }
        />
        <SettingsRow
          title="react-native-fabric"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_FABRIC)
          }
        />
        <SettingsRow
          title="react-native-fbsdk"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_FBSDK)
          }
        />
        <SettingsRow
          title="react-native-fetch-blob"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_FETCH_BLOB)
          }
        />
        <SettingsRow
          title="react-native-google-analytics-bridge"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_GOOGLE_ANALYTICS)
          }
        />
        <SettingsRow
          title="react-native-image-crop-picker"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_CROP_PICKER)
          }
        />
        <SettingsRow
          title="react-native-image-picker"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_PICKER)
          }
        />
        <SettingsRow
          title="react-navigation"
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.REACT_NAVIGATION)}
        />
        <SettingsRow
          title="react-native-push-notifications"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_PUSH_NOTIFICATIONS)
          }
        />
        <SettingsRow
          title="react-native-spinkit"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_SPINKIT)
          }
        />
        <SettingsRow
          title="react-native-swipe-list-view"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_SWIPE_LIST_VIEW)
          }
        />
        <SettingsRow
          title="react-native-vector-icons"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_VECTOR_ICONS)
          }
        />
        <SettingsRow
          title="react-redux"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_REDUX)
          }
        />
        <SettingsRow
          title="rn-viewpager"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_VIEW_PAGER)
          }
        />
        <SettingsRow
          title="react-native-firebase"
          onSelect={() =>
            Linking.openURL(CONSTANTS.WEB_URLS.REACT_NATIVE_FIREBASE)
          }
        />
        <Flex
          direction="row"
          align="center"
          justify="center"
          style={[st.pv5, st.ph4, { marginTop: 30 }]}
        >
          <Text style={[st.darkGrey, st.fs14, st.ls2]}>
            {t('ourPartners').toUpperCase()}
          </Text>
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

export default MenuAcknowledgements;
