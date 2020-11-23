import React, { ReactElement, useState } from 'react';
import { View, Linking, ImageBackground, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// import Background from 'assets/vokeWelcome.png';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import Screen from 'components/Screen';
import VokeIcon from 'components/VokeIcon';
import StatusBar from 'components/StatusBar';
import OldButton from 'components/OldButton';
import BotTalking from 'components/BotTalking';
import theme from 'utils/theme';
import CONSTANTS from 'utils/constants';
import { useMount, lockToPortrait } from 'utils';
import Background from 'assets/vokeWelcome.png';

import styles from './styles';

const Welcome = (): ReactElement => {
  const navigation = useNavigation();
  const [helpMode, setHelpMode] = useState(false);
  const { t } = useTranslation('welcome');
  const toggleTrueFalse = (): void => setHelpMode(!helpMode);
  const windowDimentions = Dimensions.get('window');

  useMount(() => {
    lockToPortrait();
  });

  return (
    <ImageBackground source={Background} style={styles.Screen}>
      <Screen testID={'welcomeScreen'} background={'transparent'}>
        <StatusBar
          animated={true}
          barStyle="light-content"
          translucent={true} // Android. The app will draw under the status bar.
          backgroundColor="transparent" // Android. The background color of the status bar.
        />
        <Flex value={1} direction="column" style={styles.SectionOnboarding}>
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
          <View>
            <Flex
              direction="column"
              justify="center"
              style={styles.HelpSection}
            >
              {helpMode ? (
                <Flex>
                  <Text
                    style={styles.HelpSectionHeading}
                    testID={'textHaveCode'}
                  >
                    {t('haveCode')}
                  </Text>
                  <Text style={styles.TextHaveCode}>{t('haveCodeInfo')}</Text>
                </Flex>
              ) : null}
            </Flex>
            {/* Information Icon */}
            <OldButton
              onPress={toggleTrueFalse}
              isAndroidOpacity
              testID={'ctaCodeInfo'}
              touchableStyle={styles.helpSectionButton}
            >
              <VokeIcon
                name="help-circle"
                size={30}
                style={styles.helpSectionIcon}
              />
            </OldButton>
          </View>
          <View style={styles.mainActions}>
            {/* BUTTON: CALL TO ACTION */}
            <Button
              onPress={(): void => navigation.navigate('AdventureCode')}
              testID={'ctaAdventureCode'}
              size="l"
              color="primary"
            >
              {t('haveCode')}
            </Button>
            <Spacer />
            {/* BUTTON: CALL TO ACTION */}
            <Button
              onPress={(): void => navigation.navigate('AccountName')}
              testID={'ctaExplore'}
              size="l"
              color="blank"
            >
              {t('toExplore')}
            </Button>
          </View>
          <Flex>
            {/* TEXT: TERMS OF SERVICE */}
            <Text style={[styles.TextSmall]}>
              {t('agreementExplore')}
              {'\n'}
              <Text
                style={styles.Link}
                onPress={(): Promise<void> =>
                  Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)
                }
              >
                {t('privacy')}
              </Text>
              &nbsp; {t('and')} &nbsp;
              <Text
                style={styles.Link}
                onPress={(): Promise<void> =>
                  Linking.openURL(CONSTANTS.WEB_URLS.TERMS)
                }
              >
                {t('tos')}
              </Text>
            </Text>
          </Flex>
          {/* SECTION: SIGN IN */}
          <Flex
            direction="row"
            align="center"
            justify="center"
            style={styles.SectionSignIn}
          >
            <View>
              <Text style={styles.SignInText}>{t('haveAccount')}</Text>
            </View>
            <OldButton
              isAndroidOpacity
              style={[styles.ButtonSignIn, { marginLeft: 20 }]}
              onPress={(): void => {
                navigation.navigate('AccountSignIn');
              }}
              testID={'ctaSignIn'}
            >
              <Text style={styles.ButtonSignInLabel}>{t('signIn')}</Text>
            </OldButton>
          </Flex>
          {/* Safe area bottom spacing */}
          <Flex
            style={{
              minHeight: theme.spacing.l,
            }}
          />
        </Flex>
      </Screen>
    </ImageBackground>
  );
};

export default Welcome;
