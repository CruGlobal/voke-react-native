import React from 'react';
import { ActivityIndicator } from 'react-native';
import Flex from '../Flex';
import Text from '../Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import st from '../../st';

function LoadingRedux() {
  return (
    <SafeAreaView>
      <Flex direction="column" align="center" justify="center" style={[st.mt3]}>
        <ActivityIndicator />
        <Text>Loading your experience</Text>
      </Flex>
    </SafeAreaView>
  );
}

export default LoadingRedux;
