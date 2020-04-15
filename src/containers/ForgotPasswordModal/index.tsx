import React, { useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Alert, Keyboard, View, Linking, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount } from '../../utils';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { passwordReset } from '../../actions/auth';
import st from '../../st';

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
  props: any
}
const ForgotPasswordModal = ( props: ForgotPasswordModalProps  ) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [activeSlide, setActiveSlide] = useState(0);
  useMount(() => {
    Orientation.lockToPortrait();
  });

  return (
    <Flex
      value={1}
      style={[
        styles.SectionOnboarding,
        // { paddingTop: insets.top }
      ]}
    >
      <StatusBar />
      <Flex direction="column" align="center" style={[st.ph1, st.w100,{marginBottom:130}]}>
         {/* TEXT: FORGOT PASSWORD */}
         <Text style={[styles.TextSmall,{textAlign:'center', marginBottom:40}]}>
            Please enter the correct email address associated with your Voke account to reset your password
          </Text>
        <TextField
          blurOnSubmit={false}
          label="Email"
          // onSubmitEditing={() => lastNameRef.current.focus()}
          placeholder={'Email'}
          // value={firstName}
          // onChangeText={text => setFirstName(text)}
          autoCapitalize="none"
          textContentType='emailAddress'
          autoCompleteType='email'
          keyboardType='email-address'
          returnKeyType={'next'}
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
          {/* BUTTON: SIGN IN*/}
          <Button
            isAndroidOpacity={true}
            style={styles.ButtonStart}
            onPress={
              () => dispatch(passwordReset( 'example@example.com' )).then(() => {
                 console.log('DONE PASSWORD RESET')
                //  navigation.navigate('CreateName')
               })
            }
          >
            <Text style={styles.ButtonStartLabel}>Reset Password</Text>
          </Button>
         
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

export default ForgotPasswordModal;
