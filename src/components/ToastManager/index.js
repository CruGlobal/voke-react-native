import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import st from '../../st';
import { REDUX_ACTIONS } from '../../constants';
import Flex from '../Flex';
import { SafeAreaView } from 'react-native-safe-area-context';
import Touchable from '../Touchable';
import Text from '../Text';

const DEFAULT_TIMEOUT = 4000;

function ToastManager() {
  const toastProps = useSelector(({ info }) => info.toastProps);
  const [isVisible, setIsVisible] = useState(false);
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (!text && toastProps.text) {
      setIsVisible(true);
      setText(toastProps.text);
      this.timeout = setTimeout(() => {
        close();
      }, toastProps.timeout || DEFAULT_TIMEOUT);
    }

    return (cleanUp = () => {
      clearTimeout(this.timeout);
    });
  }, [toastProps]);

  function close() {
    setIsVisible(false);
    setText('');
    dispatch({ type: REDUX_ACTIONS.CLEAR_TOAST });
  }

  if (!isVisible) {
    return null;
  }
  return (
    <Flex style={[st.abs, st.top(0)]} animation="fadeIn">
      <SafeAreaView style={[st.fw100]}>
        <Touchable style={[st.p4, st.bgOrange]} onPress={close}>
          <Flex align="center" justify="center">
            <Text style={[st.white, st.fs4, st.tac]}>{text}</Text>
          </Flex>
        </Touchable>
      </SafeAreaView>
    </Flex>
  );
}

export default ToastManager;
