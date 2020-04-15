import React, { useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import {  View, useWindowDimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch,useSelector } from 'react-redux';
import { useMount } from '../../utils';
import st from '../../st';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';
import CONSTANTS from '../../constants';

type GetConversationsModalProps = {
  props: any
}

const GetConversationsModal = ( props: GetConversationsModalProps  ) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.user);
  useMount(() => {
    Orientation.lockToPortrait();
  });


  return (
    <Flex
      value={1}
      style={[
        styles.SectionOnboarding,
      ]}
    >
      <StatusBar />
      <Flex direction="column" align="center" style={[st.ph1, st.w100,{marginBottom:130}]}>
         {/* TEXT: Email will be sent */}
         <Text style={[styles.TextSmall,{textAlign:'center', marginBottom:40}]}>
An email containing your conversations will be sent to the email address below. If email is unknown, please create an account</Text>
        <TextField
          label="Send Email to"
          // onSubmitEditing={() => lastNameRef.current.focus()}
          value={me.email || "email unknown"}
          // onChangeText={text => setFirstName(text)}
          textContentType='emailAddress'
          autoCompleteType='email'
          keyboardType='email-address'
          returnKeyType={'next'}
          editable={false}
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
          justify="center"
        >
                      {/* BUTTON: Send email*/}

          {me.email ?
          (
          <Button
            isAndroidOpacity={true}
            style={styles.ButtonStart}
            onPress={
              () => dispatch(getOldConversations( 'example@example.com' )).then(() => {
                Alert.alert('sentOldConversations');
                // dispatch(navigateBack());
               })
            }
          >
            <Text style={styles.ButtonStartLabel}>Send Email</Text>
          </Button>)
          : (<Button
          isAndroidOpacity={true}
          style={styles.ButtonStart}
          onPress={
            () => navigation.navigate('Profile')
          }
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
          <Text style={styles.SignInText}>
            Need some help?
          </Text>
        </View>
        <Button
          isAndroidOpacity={true}
          style={[styles.ButtonSignIn, {marginLeft:20}]}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.ButtonSignInLabel}>Support</Text>
        </Button>
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

export default GetConversationsModal;
