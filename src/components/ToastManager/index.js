import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useInterval from '../../utils/useInterval';

import { SafeAreaView } from 'react-native-safe-area-context';
import st from '../../st';
import { REDUX_ACTIONS } from '../../constants';
import Flex from '../Flex';
import Touchable from '../Touchable';
import Text from '../Text';

const DEFAULT_TIMEOUT = 4000;

const ToastManager = () => {
  const { text, timeout } = useSelector(({ info }) => info.toastProps);
  const [isVisible, setIsVisible] = useState(false);
  const [toastText, setToastText] = useState('');
  const [toastTimeout, setToastTimeout] = useState(null);
  const dispatch = useDispatch();


  // Hide message after timeout.
  // Function will fire by itself after required time passes..
  useInterval( ()=>{
      console.log( '👽 function close', toastText, toastTimeout );
      // setIsVisible(false);
      setToastText('');
      setToastTimeout(null);
      dispatch({ type: REDUX_ACTIONS.CLEAR_TOAST });
    },
    toastTimeout
  );

  useEffect(() => {
    console.log( "ToastManager");
    if (!toastText && text) {
      // setIsVisible(true);
      setToastTimeout( timeout || DEFAULT_TIMEOUT);
      setToastText(toastText);
    }

    /* if (!toastText) {
      dispatch({ type: REDUX_ACTIONS.CLEAR_TOAST });
    } */

    return ( () => {
      // setToastTimeout(null); // clears timeout.
    });
  }, [text, toastTimeout]);

  /* if (!isVisible) {
    return null;
  } */

  return (
    <>
      {toastText.lenght && (
      <Flex style={[st.abs, st.top(0)]} animation="fadeIn">
        <SafeAreaView style={[st.fw100]}>
          <Touchable style={[st.p4, st.bgOrange]} onPress={close}>
            <Flex align="center" justify="center">
              <Text style={[st.white, st.fs4, st.tac]}>{toastText}</Text>
            </Flex>
          </Touchable>
        </SafeAreaView>
      </Flex>)}
    </>
  );
};

export default ToastManager;
