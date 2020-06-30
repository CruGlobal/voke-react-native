import React from 'react';
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import { useSafeArea } from 'react-native-safe-area-context';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import CONSTANTS from '../../constants';
import { logoutAction, deleteAccountAction, facebookLogin } from '../../actions/auth';
import { useDispatch,useSelector } from 'react-redux';
import styles from './styles';
import VokeIcon from '../../components/VokeIcon';
import languageCodes from '../../i18n/languageCodes'
import i18next from 'i18next';



type ProfileModalProps = {
  props: any
}

const AccountProfile = ( props: ProfileModalProps  ) => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.user);

  // To change language use:
  // https://www.i18next.com/overview/api#changelanguage
  // change the language
  // i18next.changeLanguage("en-US-xx");

  // Facebook Login.
  // TODO: Create FB Button component.
  const fbLogin = async (): Promise<void> => {
    const userId = await dispatch(facebookLogin());
    if (!userId) {
      Alert.alert(
        "Can't sign in with Facebook",
        'Facebook authentication is not available at this moment'
      );
    } else {
      navigation.navigate('LoggedInApp');
    }
  };

  return (
    <Flex
      value={1}
      style={[
        styles.SectionOnboarding,
        // { paddingTop: insets.top }
      ]}
    >
      {/* Overscroll background color protection */}
      <Flex style={{
          backgroundColor: styles.colors.primary,
          height: 400,
          position: 'absolute',
          zIndex:0,
          width: '100%',
        }} />
      <ScrollView>
        <Flex style={{
          backgroundColor: styles.colors.primary,
          minHeight: '100%',
        }}>
          <Flex value={1} direction="column" align="center" style={[st.ph1, st.w100,{marginTop:30}]}>
            <Touchable onPress={ () => navigation.navigate('AccountPhoto', {
              onComplete: () => navigation.navigate('AccountProfile'),
            })}>
              <Flex
                direction="column"
                align="center"
                justify="center"
                style={[
                  st.w(st.fullWidth / 2.6),
                  st.h(st.fullWidth / 2.6),
                  { borderRadius: st.fullWidth / 2.6,
                    backgroundColor: styles.colors.secondaryAlt,
                  },
                ]}
              >
                <Image
                  source={{uri: me.avatar?.large || ''}}
                  style={[
                    st.w(st.fullWidth / 2.6),
                    st.h(st.fullWidth / 2.6),
                    {
                      borderRadius: st.fullWidth / 2.6,
                      borderColor: styles.colors.white,
                      borderWidth: 2
                    },
                  ]}
                />
              </Flex>
            </Touchable>

            <Touchable onPress={ () => navigation.navigate('AccountName', {
              onComplete: () => navigation.navigate('AccountProfile'),
            })}>
              <Text style={{
                color: styles.colors.white,
                fontSize: styles.fontSizes.xxxl,
                textAlign:'center',
                paddingTop:20,
                }}>
                {me.firstName + ' ' + me.lastName}
              </Text>
            </Touchable>

            { !!!me.email? <Text style={{
                color: styles.colors.white,
                fontSize: styles.fontSizes.l,
                textAlign:'center',
                }}>{t('profile:guest')}</Text>:<Text style={{
                  color: styles.colors.white,
                  fontSize: styles.fontSizes.l,
                  textAlign:'center',
                  }}>{t('profile:user')}</Text>}
                  </Flex>
            { me.email ?
            <Flex value={1} direction="column" align="flex-start" style={[st.ml2, st.w100,{marginBottom:10}]}>
              {/* <Touchable onPress={ () => navigation.navigate('AccountEmailPass')}> */}
                <Flex direction="row" align="start" justify="space-around">
                  <Text style={{color:"#fff", fontSize:18, width:'30%', textAlign: 'left', paddingRight: 20}}>{t('language')}</Text>
                  {/* <Button onPress={()=>console.log('test')} > */}
                    <Text style={{color:"#fff", fontSize:18, width:'70%'}}>{languageCodes[i18next.language].name} {languageCodes[i18next.language].name !== 'English' ? '(' + languageCodes[i18next.language].nativeName + ')' : '' }</Text>
                  {/* </Button> */}
                </Flex>
              {/* </Touchable> */}
              <View style={{minHeight: 12}} />
              {/* Extra spacing for fingers to touch the right line. */}
              <Touchable onPress={ () => navigation.navigate('AccountEmail')}>
                <Flex direction="row" align="start" justify="space-around">
                  <Text style={{color:"#fff", fontSize:18, width:'30%', textAlign: 'left', paddingRight: 20}} numberOfLines={2}>{t('profile:email')}</Text>
                  <Text style={{color:"#fff", fontSize:18, width:'70%', paddingRight:60 }} numberOfLines={2}>
                    {me.email}
                  </Text>
                </Flex>
              </Touchable>
              <View style={{minHeight: 12}} />
              {/* Extra spacing for fingers to touch the right line. */}
              <Touchable onPress={ () => navigation.navigate('AccountPass')}>
                <Flex direction="row" align="start" justify="space-around">
                  <Text style={{color:"#fff", fontSize:18, width:'30%', textAlign: 'left', paddingRight: 20}}>{t('placeholder:password')}</Text>
                  <Text style={{color:"#fff", fontSize:18, width:'70%', paddingRight:60 }}>******</Text>
                </Flex>
              </Touchable>
              <Flex direction="row" align="flex-start" justify="flex-start" style={{marginTop:30}}>
                <VokeIcon
                      name="create"
                      size={18}
                      style={[st.ml7]}
                    />
                <Text style={{color:"#fff", fontSize:14}}>{t('profile:toEdit')}</Text>
              </Flex>
            </Flex>:<></>}
            {/* <Button
              isAndroidOpacity={true}
              style={[styles.ButtonAction, {
                marginTop: 40,
                marginBottom: 40
              }]}
              onPress={
                () => dispatch(logoutAction()).then(() => {
                  // Navigate back to the very first screen.
                  // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
                  setTimeout(() => {
                    navigation.reset({
                      index: 1,
                      routes: [{ name: 'Welcome' }],
                    });
                  }, 10);
                })
              }
            >
              <Flex
                // value={1}
                direction="row"
                align="center"
                justify="center"

              >
                <Text style={styles.ButtonActionLabel}>Sign out</Text>
              </Flex>
            </Button> */}
          

          {/* SECTION: CALL TO ACTION BUTTON */}
          <Flex>

            <Flex
              direction="column"
              style={[styles.SectionAction]}
              value={1}
              justify="end"
            >
              <Flex
                style={{
                  height: styles.spacing.m
                }}
              />
              { !!!me.email && <>
                {/* TEXT:TEXT */}
                <Text style={{
                color: styles.colors.white,
                fontSize: styles.fontSizes.l,
                textAlign:'center',
                paddingBottom:20,
                }}>{t('profile:signUp')}</Text>
                <Flex
                  style={{
                    height: styles.spacing.s
                  }}
                />
                {/* BUTTON:SIGN UP WITH EMAIL */}
                <Button
                  isAndroidOpacity={true}
                  style={[styles.ButtonSignUp]}
                  onPress={
                    () => navigation.navigate('SignUp')
                  }
                >
                  <Flex
                    // value={1}
                    direction="row"
                    align="center"
                    justify="center"

                  >
                  <VokeIcon
                    name="mail"
                    size={22}
                    style={st.mr5}
                  />
                    <Text style={styles.ButtonSignUpLabel}>{t('signUpEmail')}</Text>
                  </Flex>
                </Button>
                <Flex
                  style={{
                    height: styles.spacing.m
                  }}
                />
                {/* BUTTON:SIGN UP WITH FACBOOK */}
                <Button
                  isAndroidOpacity={true}
                  style={[styles.ButtonSignUp]}
                  onPress={(): Promise<void> => fbLogin()}
                >
                  <Flex
                    // value={1}
                    direction="row"
                    align="center"
                    justify="center"
                  >
                    <VokeIcon
                      name="logo-facebook"
                      size={22}
                      style={st.mr5}
                    />
                    <Text style={styles.ButtonSignUpLabel}>{t('signUpFb')}</Text>
                  </Flex>
                </Button>
                <Flex
                  style={{
                    height: styles.spacing.m
                  }}
                />
              </>}
              <Button
                isAndroidOpacity={true}
                style={[ styles.ButtonActionTextOnly ]}
                onPress={
                  () =>
                  Alert.alert(
                    t('deleteSure'),
                    t('deleteDescription'),
                    [
                      {
                        text: t('cancel'),
                        onPress: () => {},
                        style: "cancel"
                      },
                      {
                        text: t('delete'),
                        onPress: async () => {
                          try {
                            dispatch(deleteAccountAction());
                            dispatch(logoutAction());
                          } finally {
                            // Navigate back to the very first screen.
                            // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
                             setTimeout(() => {
                              navigation.reset({
                                index: 1,
                                routes: [{ name: 'Welcome' }],
                              });
                            }, 10);
                          }
                        },
                      }
                    ]
                  )
                }
              >
                <Flex
                  // value={1}
                  direction="row"
                  align="start"
                  justify="start"

                >
                  <Text style={styles.ButtonActionLabel}>{t('deleteAccount')}</Text>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </ScrollView>

      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: styles.colors.primary,
          paddingBottom: insets.bottom
        }}
      ></Flex>
    </Flex>
  );
}

export default AccountProfile;
