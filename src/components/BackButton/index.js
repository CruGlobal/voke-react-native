import React from 'react';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function BackButton({ isClose = false, size, onPress }) {
  const navigation = useNavigation();

  return (
    <Flex self="stretch" align="start" style={{
      position: 'absolute',
      top: 0,
      left: 20,
    }}>
      <VokeIcon
        name={isClose ? 'close' : 'chevron-back-outline'}
        style={[st.ml5, st.mt5, {
          backgroundColor:'rgba(0,0,0,0.3)',
          color: 'rgba(255,255,255,0.7)',
          padding: 6,
          borderRadius: 99,
          position: 'absolute',
        }]}
        size={size || 21}
        onPress={() => {
          if(onPress) {
            onPress();
          } else {
            // Get the index of the route to see if we can go back.
            let index = navigation.dangerouslyGetState().index;
            if (index > 0) {
              navigation.goBack()
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoggedInApp' }],
              })
            }
          }
        }}
      />
    </Flex>
  );
}

export default BackButton;
