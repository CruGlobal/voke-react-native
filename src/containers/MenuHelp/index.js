import React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

  return (
    <Flex value={1} style={[st.bgWhite, { paddingBottom: insets.bottom }]}>
      <ScrollView>
        <SettingsRow
          title="Visit our Help Website"
          onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.HELP)}
        />
        <SettingsRow
          title="Visit our FAQ Website"
          onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.FAQ)}
        />
        <SettingsRow
          title="Make a Feature Request"
          onPress={() =>
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
          title="Report a User"
          onPress={() =>
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
          title="Email Us"
          onPress={() =>
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
