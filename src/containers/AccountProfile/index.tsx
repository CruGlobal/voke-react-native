import React from 'react';
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import { useSafeArea } from 'react-native-safe-area-context';
import { Alert, ScrollView, Share, Linking, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import CONSTANTS from '../../constants';
import { logoutAction, deleteAccountAction } from '../../actions/auth';
import { useDispatch,useSelector } from 'react-redux';
import styles from './styles';
import VokeIcon from '../../components/VokeIcon';


type ProfileModalProps = {
  props: any
}

function SettingsRow({ title, value, onSelect }) {
  return (
    <Touchable onPress={onSelect}>
      <Flex
        direction="row"
        align="center"
        justify="evenly"
        style={[st.pv5, st.ph4]}
      >
        <Text style={[st.darkGrey, st.fs16]}>{title}</Text>
        <Text style={[st.darkGrey, st.fs16]}>{value}</Text>
      </Flex>
    </Touchable>
  );
}

const AccountProfile = ( props: ProfileModalProps  ) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.user);

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
          <Flex value={1} direction="column" align="center" style={[st.ph1, st.w100,{marginBottom:10, marginTop:30}]}>
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
            {/* <SettingsRow
              title="Change Photo"
              // onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.VOKE)}
            /> */}
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
                }}>Guest Profile</Text>:<Text style={{
                  color: styles.colors.white,
                  fontSize: styles.fontSizes.l,
                  textAlign:'center',
                  }}>User Profile</Text>}
            {/* <Text style={{color:"#fff", fontSize:18, textDecorationLine:'underline'}}>
            Profile Info
            </Text> */}
             { me.email ?
             <>
            <Touchable onPress={ () => navigation.navigate('AccountName')}>
            <Flex direction="row" align="center" justify="space-around" style={{marginTop:30}}>
              <Text style={{color:"#fff", fontSize:18, width:'50%'}}>Language</Text>
              <Text style={{color:"#fff", fontSize:18, width:'50%'}}>English</Text>
            </Flex>
            </Touchable>
            <Touchable onPress={ () => navigation.navigate('AccountName')}>
            <Flex direction="row" align="center" justify="space-around">
            <Text style={{color:"#fff", fontSize:18, width:'50%'}}>Email</Text>
            <Text style={{color:"#fff", fontSize:18,width:'50%'}}>
                {me.email}
              </Text>
            </Flex>
            </Touchable>
            <Touchable onPress={ () => navigation.navigate('AccountName')}>
            <Flex direction="row" align="center" justify="space-around">
            <Text style={{color:"#fff", fontSize:18, width:'50%'}}>Password</Text>
            <Text style={{color:"#fff", fontSize:18,width:'50%'}}>
                ******
              </Text>
            </Flex>
            </Touchable>

            <Flex direction="row" align="flex-start" justify="flex-start" style={{marginTop:30}}>
            <VokeIcon
                    name="create"
                    size={18}
                    style={st.mr6}
                  />
              <Text style={{color:"#fff", fontSize:14}}>To edit, select the item you would like to edit.</Text>
            </Flex>
</>:
            <></>}
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
          </Flex>

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
                }}>
                    Sign up to save your progress and access your account from anywhere.
                </Text>
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
                    <Text style={styles.ButtonSignUpLabel}>Sign up with Email</Text>
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
                  /* onPress={
                    () => navigation.navigate('ForgotPassword')
                  } */
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
                    <Text style={styles.ButtonSignUpLabel}>Sign Up with Facebook</Text>
                  </Flex>
                </Button>
                <Flex
                  style={{
                    height: styles.spacing.m
                  }}
                />
              </>}
              { !!me.email && <>
                <Button
                  isAndroidOpacity={true}
                  style={[styles.ButtonAction]}
                  onPress={
                    () =>
                    Alert.alert(
                      'Are you sure?',
                      `You are about to remove your Voke account - which will delete all conversations, Adventure progress and user data, login credentials etc. You will not be able to recover this account if you proceed, but you can create a new one. Are you sure you want to do this?`,
                      [
                        {
                          text: 'Cancel',
                          onPress: () => {},
                          style: "cancel"
                        },
                        {
                          text: 'Delete',
                          onPress: async () => {
                            await dispatch(deleteAccountAction()).then(() => {
                              // logoutAction();
                              // Navigate back to the very first screen.
                              // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
                             /*  setTimeout(() => {
                                navigation.reset({
                                  index: 1,
                                  routes: [{ name: 'Welcome' }],
                                });
                              }, 10); */
                            }).finally(
                              dispatch(logoutAction())
                            )
                          },
                        }
                      ]
                    )
                  }
                >
                  <Flex
                    // value={1}
                    direction="row"
                    align="center"
                    justify="center"

                  >
                    <Text style={styles.ButtonActionLabel}>Delete My Account</Text>
                  </Flex>
                </Button>
              </>}
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
