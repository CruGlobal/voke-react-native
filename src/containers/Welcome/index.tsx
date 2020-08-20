import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  View,
  Linking,
  useWindowDimensions,
  ImageBackground,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation, initReactI18next } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useMount, lockToPortrait } from '../../utils';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import BotTalking from '../../components/BotTalking';
import VokeIcon from '../../components/VokeIcon';
import CONSTANTS from '../../constants';
import theme from '../../theme';
import Background from '../../assets/vokeWelcome.png';

import styles from './styles';

type WelcomeProps = {
  props: any;
};
const Welcome = (props: WelcomeProps) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [helpMode, setHelpMode] = useState(false);
  const { t, i18n } = useTranslation('welcome');
  const toggleTrueFalse = () => setHelpMode(!helpMode);
  const windowDimentions = Dimensions.get('window');

  useMount(() => {
    lockToPortrait();
  });

  return (
    <Flex
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1,
          backgroundColor: styles.colors.primary,
          minHeight: '100%',
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'flex-end',
        }}
      >
        <ImageBackground
          source={Background}
          style={{ width: '100%', height: '100%' }}
        >
          <StatusBar
            animated={true}
            barStyle="light-content"
            translucent={true} // Android. The app will draw under the status bar.
            backgroundColor="transparent" // Android. The background color of the status bar.
          />
          <Flex
            value={1}
            direction="column"
            justify="flex-start"
            style={[
              styles.SectionOnboarding,
              {
                // Responsive margin to fit everything on small devices.
                marginTop:
                  windowDimentions.height > 600
                    ? insets.top + theme.spacing.l
                    : insets.top,
              },
            ]}
          >
            <BotTalking
              heading={t('botMessageTitle')}
              style={{
                // Responsive margin to fit everything on small devices.
                marginBottom: windowDimentions.height < 600 ? -20 : 0,
                paddingBottom: theme.spacing.xl,
              }}
            >
              {t('botMessageContent')}
            </BotTalking>
            <Flex value={1} />
            {/* Help Mode Text */}
            <Flex
              direction="column"
              justify="center"
              style={styles.HelpSection}
            >
              {helpMode ? (
                <Flex>
                  <Text style={styles.HelpSectionHeading}>{t('haveCode')}</Text>
                  <Text
                    style={[
                      styles.TextSmall,
                      {
                        textShadowColor: 'rgba(32, 20, 16, .8)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2,
                        padding: 1,
                      },
                    ]}
                  >
                    {t('haveCodeInfo')}
                  </Text>
                </Flex>
              ) : null}
            </Flex>
            {/* Information Icon */}
            <TouchableOpacity onPress={toggleTrueFalse}>
              <VokeIcon
                name="help-circle"
                size={30}
                style={{ textAlign: 'right', marginRight: 20, color: theme.colors.white }}
              />
            </TouchableOpacity>
            <Flex style={{ paddingHorizontal: theme.spacing.l }}>
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
            </Flex>
            <Flex>
              {/* TEXT: TERMS OF SERVICE */}
              <Text style={[styles.TextSmall]}>
                {t('agreementExplore')}
                {'\n'}
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
      </ScrollView>
    </Flex>
  );
};

export default Welcome;
