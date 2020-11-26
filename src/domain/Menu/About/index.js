import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import Flex from 'components/Flex';
import Image from 'components/Image';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import { logos } from 'assets';
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

function MenuAbout(props) {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <SettingsRow
          title={t('settings:website')}
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.VOKE)}
        />
        <SettingsRow
          title={t('settings:followFb')}
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.FACEBOOK)}
        />
        <SettingsRow
          title={t('settings:tos')}
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
        />
        <SettingsRow
          title={t('settings:privacy')}
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
        />
        <SettingsRow
          title={t('settings:acknowledgements')}
          onSelect={() => navigation.navigate('Acknowledgements')}
        />
        <SettingsRow
          title={t('settings:version', {
            build: DeviceInfo.getReadableVersion(),
          })}
          onSelect={() => {
            return;
          }}
        />
        {__DEV__ && (
          <SettingsRow
            title={'StoryBook'}
            onSelect={() => navigation.navigate('StoryBook')}
          />
        )}
        {__DEV__ && (
          <SettingsRow
            title={' '}
            onSelect={() => navigation.navigate('KitchenSink')}
          />
        )}
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
            source={logos.scriptureUnion}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={logos.jesusFilm}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={logos.oneHope}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={logos.youthSpecialties}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={logos.iAmSecond}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
          <Image
            source={logos.cru}
            style={[st.w(st.fullWidth / 3), st.h(st.fullWidth / 3)]}
            resizeMode="contain"
          />
        </Flex>
      </ScrollView>
    </Flex>
  );
}

export default MenuAbout;
