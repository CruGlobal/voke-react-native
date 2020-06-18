import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useMount, lockToPortrait } from '../../utils';
import { useTranslation } from "react-i18next";
import { updateMe } from '../../actions/auth';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import VokeIcon from '../../components/VokeIcon';
import TextField from '../../components/TextField';
import Triangle from '../../components/Triangle';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import styles from './styles';
import CONSTANTS from '../../constants';

const AccountPass: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['common','placeholder']);
  const passwordRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmNewPasswordRef = useRef<TextInput>(null);

  useMount(() => {
    lockToPortrait();
  });

  const save = async (): Promise<void> => {

    if( newPassword.length <= 7 ) {
      // According to Voke API, password should be at least 8 characters long.
      Alert.alert(
        t('profile:passwordsLength'),
      );
      return;
    } else if( newPassword !== confirmNewPassword ) {
      Alert.alert(
        t('profile:passwordsMatch'),
      );
      return;
    } else {
      setIsLoading(true);

      let data = {
        me: {
          // first_name: firstName,
          // last_name: lastName,
          // email: email,
          current_password: password,
          password: newPassword,
        },
      };

      console.log( "🐸 data:", data );

      try {
        const result = await dispatch(updateMe(data));
        console.log( "🐸 result:", result );
        /* .then(() => {
          this.resetState();
        })
        .catch(e => {
          if (e && e.errors && e.errors[0]) {
            Alert.alert(e.errors[0]);
          }
        }); */
        setIsLoading(false);
        navigation.navigate('AccountProfile');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('🛑 Error on email/pass change \n', { e });
        Alert.alert(
          t('error:error'),
          e?.errors[0]
        );
        setIsLoading(false);
      }
    }
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
          {/* INPUT FIELD: PASSWORD */}
          <TextField
            ref={passwordRef}
            // blurOnSubmit={true}
            label={t('placeholder:currentPassword')}
            placeholder=""
            value={password}
            onChangeText={(text: string): void => setPassword(text)}
            secureTextEntry
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="send"
            onSubmitEditing={(): void => newPasswordRef?.current?.focus()}
          />
          {/* INPUT FIELD: NEW PASSWORD */}
          <TextField
            ref={newPasswordRef}
            // blurOnSubmit={true}
            label={t('placeholder:newPassword')}
            placeholder=""
            value={newPassword}
            onChangeText={(text: string): void => setNewPassword(text)}
            secureTextEntry
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="send"
            onSubmitEditing={(): void => confirmNewPasswordRef?.current?.focus()}
          />
          {/* INPUT FIELD: CONFIRM NEW PASSWORD */}
          <TextField
            ref={confirmNewPasswordRef}
            // blurOnSubmit={true}
            label={t('placeholder:confirmNewPassword')}
            placeholder=""
            value={confirmNewPassword}
            onChangeText={(text: string): void => setConfirmNewPassword(text)}
            secureTextEntry
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="send"
            onSubmitEditing={(): Promise<void> => save()}
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
        {/* SECTION: CALL TO ACTION BUTTON */}
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
            onPress={(): Promise<void> => save()}
            isLoading={isLoading}
          >
            <Text style={styles.ButtonStartLabel}>{t('save')}</Text>
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

export default AccountPass;