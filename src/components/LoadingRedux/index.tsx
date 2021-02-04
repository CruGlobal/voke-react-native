import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';
import st from 'utils/st';
import Flex from 'components/Flex';
import Text from 'components/Text';

const LoadingRedux = () => {
  return (
    <SafeAreaView style={[st.bgBlue, st.fh100, st.jcc]}>
      <Flex direction="column" align="center" justify="center" style={[st.mt3]}>
        <ActivityIndicator size="large" color={st.colors.white} />
        <Text style={[st.fs18, st.white, st.mt3]}>Loading your experience</Text>
      </Flex>
    </SafeAreaView>
  );
};

export default LoadingRedux;
