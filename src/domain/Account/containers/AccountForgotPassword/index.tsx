import React, { useState, useRef } from 'react';
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
import { useTranslation } from 'react-i18next';
import useKeyboard from '@rnhooks/keyboard';
import DismissKeyboardView from 'components/DismissKeyboardHOC';
import Flex from 'components/Flex';
import Text from 'components/Text';
import TextField from 'components/TextField';
import OldButton from 'components/OldButton';
import { useMount, lockToPortrait } from 'utils';
import { passwordResetAction } from 'actions/auth';
import theme from 'utils/theme';
import CONSTANTS from 'utils/constants';
import st from 'utils/st';

import styles from './styles';

const AccountForgotPassword: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const { t } = useTranslation('forgotPassword', 'placeholder');
  const passwordRef = useRef<TextInput>(null);

  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();

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

  const handleSubmit = async () => {
    await dispatch(passwordResetAction(email)).then(() => {
      Alert.alert(t('checkEmail'), t('emailPrompt'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    });
  };

  return (
    <DismissKeyboardView
      style={{ backgroundColor: styles.colors.primary, height: '100%' }}
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
          <View style={{ minHeight: 10 }} />
          <TextField
            // blurOnSubmit={false}
            label={t('placeholder:email')}
            onSubmitEditing={handleSubmit}
            placeholder="Email"
            value={email}
            onChangeText={checkEmail}
            autoCapitalize="none"
            textContentType="emailAddress"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="send"
            autoFocus={true}
          />
        </Flex>

        <Flex
          value={2}
          direction="column"
          justify="start"
          style={styles.SectionAction}
        >
          {/* BUTTON: RESET PASSWORD */}
          <OldButton
            isAndroidOpacity
            touchableStyle={[
              st.pd4,
              st.br1,
              st.w(st.fullWidth - 70),
              {
                backgroundColor: theme.colors.white,
                textAlign: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.5,
                elevation: 4,
                shadowRadius: 5,
                shadowOffset: { width: 1, height: 8 },
              },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.ButtonStartLabel}>
              {t('forgotPassword:resetPassword')}
            </Text>
          </OldButton>
        </Flex>
      </KeyboardAvoidingView>
      {!isKeyboardVisible && (
        <>
          {/* SECTION: NEED HELP? */}
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
            <OldButton
              isAndroidOpacity
              style={[styles.ButtonSignIn, { marginLeft: 20 }]}
              onPress={() => navigation.navigate('Help')}
            >
              <Text style={styles.ButtonSignInLabel}>Support</Text>
            </OldButton>
          </Flex>
          {/* Safe area at the bottom for phone with exotic notches */}
          <Flex
            style={{
              paddingBottom: insets.bottom,
            }}
          />
        </>
      )}
    </DismissKeyboardView>
  );
};

export default AccountForgotPassword;
