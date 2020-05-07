import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  Alert,
  Keyboard,
  Platform,
  View,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount, lockToPortrait } from '../../utils';
import { passwordReset } from '../../actions/auth';
import st from '../../st';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';
import CONSTANTS from '../../constants';

type ForgotPasswordModalProps = {
  props: any;
};
const AccountForgotPassword: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  useMount(() => {
    lockToPortrait();
  });

  const checkEmail = (text: string) => {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    if (emailValidation) {
      setEmailValid(true);
    }
    setEmail(text);
  };

  return (
    <DismissKeyboardView
      style={{ backgroundColor: styles.colors.secondary, height: '100%' }}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}

      {/* Makes possible to hide keyboard when tapping outside. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // TODO: Verify!
        style={styles.MainContainer}
      >
        <Flex
          value={4}
          direction="column"
          align="center"
          justify="center"
          style={[styles.PrimaryContent, { paddingTop: insets.top + 30 }]}
        >
          <Text
            style={[
              styles.TextLarge,
              {
                textAlign: 'center',
                backgroundColor: styles.colors.primary,
              },
            ]}
          >
            Please enter the correct email address associated with your Voke
            account to reset your password.
          </Text>
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
        </Flex>
        {/* TRIANGLE DIVIDER */}
        <Flex value={1} justify="end" style={styles.Divider}>
          <Triangle
            width={useWindowDimensions().width}
            height={40}
            color={styles.colors.secondary}
          />
        </Flex>
        <Flex
          value={2}
          direction="column"
          justify="start"
          style={styles.SectionAction}
        >
          {/* BUTTON: SIGN IN */}
          <Button
            isAndroidOpacity
            style={styles.ButtonStart}
            onPress={() =>
              dispatch(passwordResetAction('example@example.com')).then(() => {
              console.log('DONE PASSWORD RESET');
              //  navigation.navigate('AccountName')
            })
            }
          >
            <Text style={styles.ButtonStartLabel}>Reset Password</Text>
          </Button>
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
        <View>
          <Text style={styles.SignInText}>Need some help?</Text>
        </View>
        <Button
          isAndroidOpacity
          style={[styles.ButtonSignIn, { marginLeft: 20 }]}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.ButtonSignInLabel}>Support</Text>
        </Button>
      </Flex>
      </KeyboardAvoidingView>
      {/* Safe area at the bottom for phone with exotic notches */}
      <Flex
        style={{
          paddingBottom: insets.bottom,
        }}
      />
    </DismissKeyboardView>
  );
};

export default AccountForgotPassword;
