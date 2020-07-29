import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import Communications from 'react-native-communications';
import { useDispatch } from 'react-redux';
import Flex from '../../components/Flex';
import st from '../../st';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';

import CONSTANTS from '../../constants';

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

function MenuHelp(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation('settings');

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView>
        <SettingsRow
          title={t('visitFAQ')}
          onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.FAQ)}
        />
        <SettingsRow
          title={t('featureRequest')}
          onSelect={() =>
            Communications.email(
              ['support@vokeapp.com'], // TO
              null, // CC
              null, // BCC
              'Feature Request for Voke', // SUBJECT
              null, // BODY
            )
          }
        />
        <SettingsRow
          title={t('report')}
          onSelect={() =>
            Communications.email(
              ['support@vokeapp.com'], // TO
              null, // CC
              null, // BCC
              'I would like to report a user', // SUBJECT
              null, // BODY
            )
          }
        />
        <SettingsRow
          title={t('email')}
          onSelect={() =>
            Communications.email(
              ['support@vokeapp.com'], // TO
              null, // CC
              null, // BCC
              'Email to Voke Support', // SUBJECT
              null, // BODY
            )
          }
        />
      </ScrollView>
    </Flex>
  );
}

export default MenuHelp;
