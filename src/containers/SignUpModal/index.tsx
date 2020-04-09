import React, { useState, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Alert, Keyboard, View, Linking, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useMount } from '../../utils';
import st from '../../st';
import { logoutAction, userLogin } from '../../actions/auth';
import { useSelector } from 'react-redux';
import VokeIcon from '../../components/VokeIcon';

import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import TextField from '../../components/TextField';
import StatusBar from '../../components/StatusBar';
import Button from '../../components/Button';
import Triangle from '../../components/Triangle';
import styles from './styles';
import CONSTANTS from '../../constants';

type SignUpModalProps = {
  props: any
}

const SignUpModal = ( props: SignUpModalProps  ) => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const anonUserId = useSelector(({ auth }: any) => auth.user.id);

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

  const checkEmail = ( text:string ) => {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    if ( emailValidation ) {
      setEmailValid( true );
    }
    setEmail(text);
  }

  const login = () => {
    // const { t, isAnonUser, dispatch } = this.props;
    // const {  email, password, anonUserId } = this.state;
    console.log( "login" );
    if (emailValid && password) {
      setIsLoading(true);

      // NEW

      dispatch(logoutAction()).then(() => {
        console.log('login > loggedout 2'  );

        dispatch( userLogin(email, password) )
            /* .then(() => {
              setIsLoading(false );
              console.log('login > success'  );
              // dispatch({ type: RESET_ANON_USER });
              // dispatch(navigateResetHome());
            })
            .catch((e) => {
              console.log('login > error', {e}  );
              setIsLoading(false );
            }); */
      });
      console.log('login > loggedout 1'  );
      // () => navigation.navigate('Adventures')
      // OLD
      /* if (isAnonUser) {
        // log out and destroy anon devices
        dispatch(logoutAction()).then(() => {
          dispatch(anonLogin(email, password, anonUserId))
            .then(() => {
              this.setState({ isLoading: false });
              dispatch({ type: RESET_ANON_USER });
              dispatch(navigateResetHome());
            })
            .catch(() => {
              this.setState({ isLoading: false });
            });
        });
      } else {
        dispatch(anonLogin(email, password))
          .then(() => {
            this.setState({ isLoading: false });
            dispatch({ type: RESET_ANON_USER });
            dispatch(navigateResetHome());
          })
          .catch(() => {
            this.setState({ isLoading: false });
          });
      }
    */

    /* } else {
      // Alert.alert(t('invalid'), t('enterValid'));
    } */
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
      <Flex direction="column" align="center" style={[st.ph1, st.w100,{marginBottom:70}]}>
      <Text style={[styles.TextSmall,{textAlign:'center'}]}>
            Sign up to save your current progress using the Voke app.
          </Text>
        <TextField
          // blurOnSubmit={false}
          label="Email"
          onSubmitEditing={() => passwordRef.current.focus()}
          placeholder={'Email'}
          value={email}
          onChangeText={checkEmail}
          autoCapitalize='none'
          textContentType='emailAddress'
          autoCompleteType='email'
          keyboardType='email-address'
          returnKeyType={'next'}
        />
        <TextField
          ref={passwordRef}
          // blurOnSubmit={true}
          label="Password"
          placeholder={'Password'}
          value={password}
          onChangeText={ text => setPassword(text) }
          secureTextEntry={true}
          textContentType='password'
          autoCompleteType='password'
          returnKeyType={'send'}
          // onSubmitEditing={handleContinue}
        />
      </Flex>
      {/* SECTION: CALL TO ACTION BUTTON */}
      <Flex value={1}>
        <Triangle
          width={useWindowDimensions().width}
          height={40}
          color={styles.colors.darkBlue}
        />
        <Flex
          direction="column"
          style={[styles.SectionAction]}
          value={1}
          justify="evenly"
        >
          {/* BUTTON: SIGN IN*/}
          <Button
            isAndroidOpacity={true}
            style={styles.ButtonStart}
            onPress={ () => login() }
          >
            <Text style={styles.ButtonStartLabel}>Sign Up</Text>
          </Button>
        </Flex>
      </Flex>
         {/* SECTION: SIGN IN */}
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
            Already have an account?
          </Text>
        </View>
        <Button
          isAndroidOpacity={true}
          style={[styles.ButtonSignIn, {marginLeft:20}]}
          onPress={() => {
            navigation.navigate('SignInModal');
            // navigation.navigate('SignInModal', { shouldMerge: true })
          }}
        >
          <Text style={styles.ButtonSignInLabel}>Sign In</Text>
        </Button>
      </Flex>
      {/* Safe area bottom spacing */}
      <Flex
        style={{
          backgroundColor: styles.colors.darkBlue,
          paddingBottom: insets.bottom
        }}
      ></Flex>
    </Flex>
  );
}

export default SignUpModal;
