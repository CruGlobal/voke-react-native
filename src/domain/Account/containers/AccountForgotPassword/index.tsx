import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Alert, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useKeyboard } from '@react-native-community/hooks';
import DismissKeyboardView from 'components/DismissKeyboardHOC';
import Flex from 'components/Flex';
import Text from 'components/Text';
import TextField from 'components/TextField';
import OldButton from 'components/OldButton';
import { passwordResetAction } from 'actions/auth';
import theme from 'utils/theme';
import st from 'utils/st';
import { useMount, lockToPortrait } from 'utils';

import styles from './styles';

const AccountForgotPassword: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const { t } = useTranslation('forgotPassword', 'placeholder');

  // https://github.com/react-native-hooks/keyboard#configuration
  const keyboard = useKeyboard();

  useMount(() => {
    lockToPortrait();
  });

  const checkEmail = (text: string) => {
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
      {!keyboard.keyboardShown && (
        <>
          {/* SECTION: NEED HELP? */}
          <Flex
            direction="row"
            align="center"
            justify="center"
            style={styles.SectionSignIn}
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
