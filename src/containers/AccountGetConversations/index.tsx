import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { View, useWindowDimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useMount, lockToPortrait } from '../../utils';
import { getOldConversations } from '../../actions/auth';
import st from '../../st';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';

type GetConversationsModalProps = {
  props: any;
};

const AccountGetConversations = (props: GetConversationsModalProps) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }: RootState) => auth.user);
  useMount(() => {
    lockToPortrait();
  });

  return (
    <Flex value={1} style={[styles.MainContainer]}>
      <Flex value={1} style={[styles.SectionPrimary]}>
        <Text
          style={[
            styles.TextLarge,
            { textAlign: 'center', marginBottom: 40, marginTop: 60 },
          ]}
        >
          An email containing your conversations will be sent to the email address
          below. If email is unknown, please create an account.
        </Text>
        <Flex
          direction="column"
          align="center"
          style={[st.ph1, st.w100, { marginBottom: 130 }]}
        >
          {/* TEXT: Email will be sent */}

          <TextField
            label="Send Email to"
            // onSubmitEditing={() => lastNameRef.current.focus()}
            value={me.email || 'email unknown'}
            // onChangeText={text => setFirstName(text)}
            textContentType="emailAddress"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            editable={false}
          />
        </Flex>
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
          justify="center"
        >
          {/* BUTTON: Send email */}

          {me.email ? (
            <Button
              isAndroidOpacity
              style={styles.ButtonStart}
              onPress={(): void => {
                dispatch(getOldConversations()).then(
                  () => {
                    Alert.alert(
                      'Success!',
                      'Check your email for information on your old conversations.',
                      [
                        { text: "OK", onPress: () => navigation.goBack() }
                      ]
                    );
                  },
                );
              }}
            >
              <Text style={styles.ButtonStartLabel}>Send Email</Text>
            </Button>
          ) : (
            <Button
              isAndroidOpacity
              style={styles.ButtonStart}
              onPress={() => navigation.navigate('AccountCreate')}
            >
              <Text style={styles.ButtonStartLabel}>Create Account</Text>
            </Button>
          )}
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

export default AccountGetConversations;
