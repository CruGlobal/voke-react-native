import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { View, Linking, useWindowDimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount, lockToPortrait } from '../../utils';
import { useTranslation, initReactI18next } from "react-i18next";

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import BotTalking from '../../components/BotTalking';
import VokeIcon from '../../components/VokeIcon';

import styles from './styles';
import CONSTANTS from '../../constants';
import st from '../../st';

import Background from '../../assets/vokeWelcome.png';
import { TouchableOpacity } from 'react-native-gesture-handler';


type WelcomeProps = {
  props: any;
};
const Welcome = (props: WelcomeProps) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [helpMode, setHelpMode]= useState(false)
  const { t, i18n } = useTranslation('welcome');
  const toggleTrueFalse = () => setHelpMode(!helpMode);

  useMount(() => {
    lockToPortrait();
  });

  return (
    <Flex value={1} >
      <ImageBackground source={Background} style={{width: '100%', height: '100%'}}>
      <StatusBar />
      <Flex value={1} direction="column" justify="flex-start" style={[styles.SectionOnboarding, {marginTop:60}]}>
      <BotTalking heading={t('botMessageTitle')}>{t('botMessageContent')}</BotTalking>
      {/* Help Mode Text */}
      <Flex direction="column" justify="center" style={styles.HelpSection}>
        { helpMode?
          <Flex>
            <Text style={styles.HelpSectionHeading}>{t('haveCode')}</Text>
            <Text style={styles.TextSmall}>{t('haveCodeInfo')}</Text>
          </Flex>
        : null }
      </Flex>
      {/* Information Icon */}
      <TouchableOpacity onPress={toggleTrueFalse}>
        <VokeIcon
          name="help-circle"
          size={30}
          style={{ textAlign:'right', marginRight:20}}
        />
      </TouchableOpacity>
      {/* BUTTON: CALL TO ACTION */}
      <Button
        isAndroidOpacity
        style={styles.ButtonPrimary}
        onPress={() => navigation.navigate('AdventureCode')}
      >
        <Flex direction="row" justify="center">
          <Text style={styles.ButtonLabelPrimary}>{t('haveCode')}</Text>
        </Flex>
      </Button>
      {/* BUTTON: CALL TO ACTION */}
      <Button
        isAndroidOpacity
        style={styles.ButtonWhite}
        onPress={() => navigation.navigate('AccountName')}
      >
        <Flex direction="row" justify="center">
          <Text style={styles.ButtonLabelWhite}>{t('toExplore')}</Text>
        </Flex>
      </Button>
      <Flex>
        {/* TEXT: TERMS OF SERVICE */}
        <Text style={[styles.TextSmall]}>
          {t('agreementExplore')}{'\n'}
          <Text
            style={styles.Link}
            onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
          >
            {t('privacy')}
          </Text>
          &nbsp; {t('and')} &nbsp;
          <Text
            style={styles.Link}
            onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
          >
            {t('tos')}
          </Text>
        </Text>
      </Flex>
      {/* SECTION: SIGN IN */}
      <Flex
        // value={1}
        direction="row"
        align="center"
        justify="center"
        style={styles.SectionSignIn}
      >
        <View>
          <Text style={styles.SignInText}>{t('haveAccount')}</Text>
        </View>
        <Button
          isAndroidOpacity
          style={[styles.ButtonSignIn, { marginLeft: 20 }]}
          onPress={() => {
            navigation.navigate('AccountSignIn');
          }}
        >
          <Text style={styles.ButtonSignInLabel}>{t('signIn')}</Text>
        </Button>
      </Flex>
      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: 'transparent',
          paddingBottom: insets.bottom,
        }}
      />
</Flex>
</ImageBackground>
    </Flex>
  );
};

export default Welcome;
