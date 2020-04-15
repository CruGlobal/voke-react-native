import React, { useState, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  View,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getTimeZone, getCountry, getLocales } from 'react-native-localize';
import { useDispatch, useSelector } from 'react-redux';
import { useMount } from '../../utils';
import st from '../../st';
import {
  logoutAction,
  userLogin,
  createAccount,
  updateMe,
} from '../../actions/auth';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';
import CONSTANTS from '../../constants';

type CreateAccountProps = {
  props: any;
};
const CreateAccount = (props: CreateAccountProps) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const firstName = useSelector(({ auth }: any) => auth.user.firstName);
  const lastName = useSelector(({ auth }: any) => auth.user.lastName);
  const avatar = useSelector(({ auth }: any) => auth.user.avatar);

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = React.useRef();

  useMount(() => {
    Orientation.lockToPortrait();
  });

  /* useEffect(() => {
    effect
    return () => {
      cleanup
    }
  }, [input]) */

  const checkEmail = (text: string) => {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    if (emailValidation) {
      setEmailValid(true);
    }
    setEmail(text);
  };

  async function register() {
    // const { t, isAnonUser, dispatch } = this.props;
    // const {  email, password, anonUserId } = this.state;
    console.log('register');
    if (emailValid && password) {
      setIsLoading(true);

      const userData = {
        first_name: firstName,
        last_name: lastName,
        avatar,
      };

      console.log('userData:');
      console.log(userData);

      // try {
      /*  await dispatch(
            createAccount(userData)
        ); */
      // By this point guest account already created.
      // All we need is to add new data.
      /* await dispatch(
          // API docs: https://docs.vokeapp.com/#me-update-me
          updateMe({
            me: {
              first_name: firstName,
              last_name: lastName,
              email: email,
              password: password,
              timezone_name: getTimeZone(),
              country_code: getCountry(),
              language: {
                language_code: getLocales(),
              },
            },
          }).then(() => {
            console.log( "User's Email/Pass updated." );
          }).catch(( e ) => {
            console.log("🛑 Error updating the user's Email/Pass \n", e);
            if (e && e.errors && e.errors[0]) {
              Alert.alert(e.errors[0]);
            }
          })
        ) */

      try {
        const updateResults = await dispatch(
          // API docs: https://docs.vokeapp.com/#me-update-me
          updateMe({
            me: {
              first_name: firstName,
              last_name: lastName,
              email,
              password,
              timezone_name: getTimeZone(),
              /* country_code: getCountry(),
              language: {
                language_code: getLocales(),
              }, */
            },
          }),
        );

        console.log('updateResults:');
        console.log(updateResults);

        console.log("User's Email/Pass updated.");
        await dispatch(userLogin(email, password));
        navigation.navigate('CreateName');
      } catch (e) {
        console.log("🛑 Error updating the user's Email/Pass \n", e);
        Alert.alert(e.error_description ? e.error_description : e.errors[0]);
      }
    } else {
      Alert.alert(
        'Invalid email/password',
        'Please enter a valid email and password',
      );
    }
  }

  return (
    <Flex
      value={1}
      style={[
        styles.SectionOnboarding,
        // { paddingTop: insets.top }
      ]}
    >
      <StatusBar />
      <Flex
        direction="column"
        align="center"
        style={[st.ph1, st.w100, { marginBottom: 30 }]}
      >
        <TextField
          // blurOnSubmit={false}
          label="Email"
          onSubmitEditing={() => passwordRef.current.focus()}
          placeholder="Email"
          value={email}
          onChangeText={checkEmail}
          autoCapitalize="none"
          textContentType="emailAddress"
          autoCompleteType="email"
          keyboardType="email-address"
          returnKeyType="next"
        />
        <TextField
          ref={passwordRef}
          // blurOnSubmit={true}
          label="Password"
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          textContentType="password"
          autoCompleteType="password"
          returnKeyType="send"
          // onSubmitEditing={handleContinue}
        />
      </Flex>
      {/* SECTION: CALL TO ACTION BUTTON */}
      <Flex value={1}>
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
          {/* BUTTON: SIGN IN */}
          <Button
            isAndroidOpacity
            style={styles.ButtonStart}
            onPress={register}
          >
            <Text style={styles.ButtonStartLabel}>Create Account</Text>
          </Button>
          {/* TEXT: TERMS OF SERVICE */}
          <Text style={[styles.TextSmall, { textAlign: 'center' }]}>
            By creating an account you agree to our
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
      </Flex>
      {/* SECTION: FACEBOOK SIGN IN */}
      <Flex
        // value={1}
        direction="row"
        align="center"
        justify="center"
        style={styles.SectionSignIn}
        // width={useWindowDimensions().width}
      >
        {/*  <View>
          <Text style={styles.SignInText}>
            Already have an account?
          </Text>
        </View> */}
        <Button
          isAndroidOpacity
          style={[styles.ButtonSignIn, { marginLeft: 20 }]}
          /* onPress={
            () => navigation.navigate('ForgotPassword')
          } */
        >
          <Text style={styles.ButtonSignInLabel}>Sign Un with Facebook</Text>
        </Button>
      </Flex>
      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: styles.colors.secondary,
          paddingBottom: insets.bottom,
        }}
      />
    </Flex>
  );
};

export default CreateAccount;
