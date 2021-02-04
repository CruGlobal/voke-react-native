import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import useInterval from 'utils/useInterval';
import { REDUX_ACTIONS } from 'utils/constants';
import st from 'utils/st';
import Flex from 'components/Flex';
import Touchable from 'components/Touchable';
import Text from 'components/Text';

import { RootState } from '../../reducers';

const DEFAULT_TIMEOUT = 4000;

const ToastManager = (): React.ReactElement => {
  // New in-app notifications to display as toasts are stored in:
  // - store.info.toastProps.
  const { text, timeout } = useSelector(
    ({ info }: RootState) => info.toastProps,
  );

  const [toastText, setToastText] = useState('');
  const [toastTimeout, setToastTimeout] = useState(null);
  const dispatch = useDispatch();

  const hideMessage = (): void => {
    dispatch({ type: REDUX_ACTIONS.CLEAR_TOAST });
  };

  // Hide message after timeout.
  // Function will fire by itself after required time passes..
  useInterval(() => {
    hideMessage();
  }, toastTimeout);

  useEffect(() => {
    // Note: don't use text !== null we need text != null here!
    if (toastText === '' && text != null) {
      setToastTimeout(timeout || DEFAULT_TIMEOUT);
      setToastText(text);
    } else if (toastText !== '' && text == null) {
      setToastText('');
      setToastTimeout(null);
    }
  }, [text, toastText, toastTimeout]);

  return (
    <>
      {toastText.length > 0 && (
        <Flex style={[st.abs, st.top(0)]}>
          <SafeAreaView style={[st.fw100]}>
            <Touchable style={[st.p4, st.bgOrange]} onPress={hideMessage}>
              <Flex align="center" justify="center">
                <Text style={[st.white, st.fs4, st.tac]} testID={'textToast'}>
                  {toastText}
                </Text>
              </Flex>
            </Touchable>
          </SafeAreaView>
        </Flex>
      )}
    </>
  );
};

export default ToastManager;
