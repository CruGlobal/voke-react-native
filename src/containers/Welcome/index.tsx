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
  const { t, i18n } = useTranslation();

  useMount(() => {
    lockToPortrait();
  });
  const toggleTrueFalse = () => setHelpMode(!helpMode);

  return (
    <Flex value={1} >

<ImageBackground source={Background} style={{width: '100%', height: '100%'}}>
<StatusBar />
  <Flex value={1} direction="column" justify="flex-start" style={[styles.SectionOnboarding, {marginTop:60}]}>
  <BotTalking heading="Welcome to Voke!">{t('botWelcomeMessage')}</BotTalking>
  {/* We’re engaging in video series exploring questions about faith and Jesus, together. */}

  {/* Help Mode Text */}

  <Flex direction="column" justify="center" style={styles.HelpSection}>
  {helpMode?
    <Flex><Text style={styles.HelpSectionHeading}>I have an adventure Code</Text>
    <Text style={styles.TextSmall}>You get to do video adventures with others in Voke. Choose this if you recieved an Adventure invite code to easily join your friend or group. </Text>
 </Flex>
    : null   }
    </Flex>

  {/* Informtion Icon */}
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
            <Text style={styles.ButtonLabelPrimary}>I have an Adventure Code</Text>
            {/* <VokeIcon
                    name="arrow-left2"
                    size={22}
                    style={{ transform: [{ rotateY: '180deg' }]} }
                  /> */}
                  </Flex>
          </Button>
           {/* BUTTON: CALL TO ACTION */}
           <Button
            isAndroidOpacity
            style={styles.ButtonWhite}
            onPress={() => navigation.navigate('AccountName')}
          >            
          <Flex direction="row" justify="center">
            <Text style={styles.ButtonLabelWhite}>I'd like to Explore</Text>
            {/* <VokeIcon
                    name="arrow-left2"
                    size={22}
                    style={{ transform: [{ rotateY: '180deg' }], color: styles.colors.secondary} }
                  /> */}
                  </Flex>
          </Button>
<Flex>
      {/* TEXT: TERMS OF SERVICE */}
      <Text style={[styles.TextSmall]}>
            By exploring, you agree to our
            {'\n'}
            <Text
              style={styles.Link}
              onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
            >
              Privacy Policy
            </Text>
            &nbsp; and &nbsp;
            <Text
              style={styles.Link}
              onPress={() => Linking.openURL(CONSTANTS.WEB_URLS.TERMS)}
            >
              Terms of Service
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
          <Text style={styles.SignInText}>Already have an account?</Text>
        </View>
        <Button
          isAndroidOpacity
          style={[styles.ButtonSignIn, { marginLeft: 20 }]}
          onPress={() => {
            navigation.navigate('AccountSignIn');
          }}
        >
          <Text style={styles.ButtonSignInLabel}>Sign In</Text>
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
