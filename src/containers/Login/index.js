import React, { useState, useRef, forwardRef } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import StatusBar from '../../components/StatusBar';
import st from '../../st';
import Touchable from '../../components/Touchable';
import { useNavigation } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import {
  logoutAction,
  loginAction,
  login,
  register,
  passwordReset,
} from '../../actions/auth';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

const LoginInput = forwardRef(({ ...rest }, ref) => {
  return (
    <TextInput
      ref={ref}
      style={[
        st.w100,
        {
          borderRadius: 50,
          backgroundColor: st.colors.white,
          margin: 5,
          paddingLeft: 20,
          height: 40,
          color: '#755a68',
          fontSize: 17,
        },
      ]}
      underlineColorAndroid={'transparent'}
      placeholderTextColor={st.colors.normalText}
      contextMenuHidden={true}
      returnKeyType={'next'}
      autoCapitalize={'none'}
      spellCheck={false}
      keyboardAppearance={'dark'}
      {...rest}
    />
  );
});

function Login(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const passwordRef = useRef(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValidLoginInfo = () => username.length > 4 && password.length > 4;

  function handleLogin() {
    dispatch(loginAction({ id: 123 }));
    return;

    if (isValidLoginInfo()) {
      try {
        setLoginLoading(true);
        dispatch(login(username, password));
      } finally {
        setLoginLoading(false);
      }
    } else {
      Alert.alert(
        'Login Failed',
        'Email or password are too short. Please try again.',
      );
    }
  }

  function handleRegister() {
    if (isValidLoginInfo()) {
      try {
        setLoginLoading(true);
        dispatch(register(username, password));
      } finally {
        setLoginLoading(false);
      }
    } else {
      Alert.alert(
        'Registeration Failed',
        'Email or password are too short. Please try again.',
      );
    }
  }

  function handleForgot() {
    if (username.length > 4) {
      try {
        setLoginLoading(true);
        dispatch(passwordReset(username));
      } finally {
        setLoginLoading(false);
      }
    } else {
      Alert.alert(
        'Password Reset Error',
        'Please enter a valid email address above and then tap this button to receive an email to reset your password.',
      );
    }
  }

  return (
    <Flex value={1}>
      <StatusBar />
      colors={[st.colors.darkOrange, st.colors.purple]}
      style={[{ paddingTop: insets.top, height: '100%' }, st.aic, st.jcc]}>
      <Flex direction="row" align="center" justify="center" style={[st.m(20)]}>
        <Icon name="tribl" size={35} />
        <Icon name="tribl_logo" size={35} style={[st.w(130)]} />
      </Flex>
      <ActivityIndicator style={[st.m5, { opacity: loginLoading ? 1 : 0 }]} />
      <KeyboardAvoidingView
        behavior="padding"
        style={[st.aic, st.w60, { opacity: loginLoading ? 0 : 1 }]}
      >
        {/* <Touchable
            onPress={() => dispatch(facebookLogin())}
            style={[st.fw60, st.h(35), st.bgPinkLight, st.fdr, st.jcc, st.aic, st.br(50)]}
          >
            <Text style={[st.white, st.fs(13), st.bold, st.tac, st.fontTitle, st.asc, st.mt6]}>
              LOG IN WITH FACEBOOK
            </Text>
            <Icon name="tribl" size={25} style={[st.mr5]} />
          </Touchable>
          <Text style={[st.normalText, st.fs3, st.m4]}>OR</Text> */}
        <LoginInput
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current.focus()}
          placeholder={'Email'}
          value={username}
          onChangeText={text => setUsername(text)}
          keyboardType={'email-address'}
          returnKeyType={'next'}
        />
        <LoginInput
          ref={passwordRef}
          blurOnSubmit={true}
          placeholder={'Password'}
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          returnKeyType={'done'}
        />
        <Flex
          direction="row"
          align="center"
          justify="between"
          style={[st.mt5, st.w100]}
        >
          <Touchable onPress={handleLogin} style={[st.f1]}>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={[st.h(35), st.bgPinkLight, st.br(50)]}
            >
              <Text
                style={[
                  st.white,
                  st.fs(13),
                  st.bold,
                  st.tac,
                  st.fontTitle,
                  st.asc,
                  st.mt6,
                ]}
              >
                LOGIN
              </Text>
            </Flex>
          </Touchable>

          <Touchable onPress={handleRegister} style={[st.f1]}>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={[
                st.h(35),
                st.bgPinkLight,
                st.bw1,
                st.borderPink,
                st.bgTransparent,
                st.ml6,
                st.br(50),
              ]}
            >
              <Text
                style={[
                  st.white,
                  st.fs(13),
                  st.bold,
                  st.tac,
                  st.fontTitle,
                  st.asc,
                  st.mt6,
                ]}
              >
                JOIN FREE
              </Text>
            </Flex>
          </Touchable>
        </Flex>
        <Touchable onPress={handleForgot}>
          <Flex direction="row" align="center" justify="center">
            <Text style={[st.normalText, st.fs4, st.m5]}>Forgot Password?</Text>
          </Flex>
        </Touchable>
      </KeyboardAvoidingView>
      <Flex style={[st.fh10]} />
    </Flex>
  );
}

export default Login;
