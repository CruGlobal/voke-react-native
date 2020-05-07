import React from 'react';
import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import CONSTANTS from '../../constants';
import { logoutAction } from '../../actions/auth';
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

  console.log("*************MEEEEEE**************", me)
  return (
    <Flex
    value={1}
    style={[
      styles.SectionOnboarding,
      // { paddingTop: insets.top }
    ]}
  >
      <ScrollView>
      <StatusBar />
      <Flex direction="column" align="center" style={[st.ph1, st.w100,{marginBottom:10, marginTop:30}]}>
      <Image resizeMode="contain" source={{uri: me.avatar.large}} style={{width:100, height:100, borderColor: '#fff',
            borderWidth: 1, borderRadius: 50}} />

        <SettingsRow
          title="Change Photo"
          // onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.VOKE)}
        />
        <Text style={{color:"#fff", fontSize:24, marginTop:20, marginBottom:50}}>
        {me.firstName+" "+ me.lastName}
        </Text>
        <Text style={{color:"#fff", fontSize:18, textDecorationLine:'underline'}}>
        Profile Info
        </Text>
        <Flex direction="row" align="center" justify="center" style={{marginTop:20, marginBottom:20}}>
        <Text style={{color:"#fff", fontSize:18, width:150}}>Language</Text>
  <Text style={{color:"#fff", fontSize:18,}}>{me.firstName}</Text>
        </Flex>
        <Flex direction="row" align="center">

        <SettingsRow
          title="Delete My Account"
          // onSelect={() => Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)}
        />

</Flex>
<Flex direction="row" align="center">

<SettingsRow
          title="Sign out of my account"
          // onSelect={() => navigation.navigate('Acknowledgements')}
        />

</Flex>
      
       
        </Flex>
      </ScrollView>
      {/* SECTION: CALL TO ACTION BUTTON */}
      <Flex value={3}>
        <Triangle
          width={useWindowDimensions().width}
          height={40}
          color={styles.colors.secondary}
        />
        <Flex
          direction="column"
          style={[styles.SectionAction]}
          value={1}
          justify="evenly"
        >
          {/* TEXT:TEXT */}
          <Text style={[styles.TextSmall,{textAlign:'center'}]}>
            <Text style={[styles.TextSmall,{textAlign:'center', paddingBottom:30}]
                        }            >
             Sign up to save your progress and access your account from anywhere.
            </Text>
          </Text>

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
        type="image"
        name="email"
        style={[st.h(22), st.w(22), st.mr5]}
      />
          <Text style={styles.ButtonSignUpLabel}>Sign up with Email</Text>
          </Flex>
        </Button>

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
        type="image"
        name="facebook"
        style={[st.h(22), st.w(22), st.mr5]}
      />
          <Text style={styles.ButtonSignUpLabel}>Sign Up with Facebook</Text>
          </Flex>
        </Button>
        </Flex>
      </Flex>

      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: styles.colors.secondary,
          paddingBottom: insets.bottom
        }}
      ></Flex>
    </Flex>
  );
}

export default AccountProfile;
