import React from 'react';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import st from '../../st';
import Icon from '../Icon';

function TrackCard({ source, style, badge, onPress, ...rest }) {
  return (
    <Touchable onPress={onPress} style={[st.pb4]}>
      <Flex direction="row">
        <Flex direction="column" value={4}>
          <Flex direction="row">
            <Icon name="tribl" size={12} />
            <Text style={[st.white, st.fs4, st.bold, st.pl6]} numberOfLines={1}>
              Brither than the morning featuring danile be Brither than the morning featuring danile be
            </Text>
          </Flex>
          <Text style={[st.normalText, st.fs5]}>Harvest • Brighter the morning - single</Text>
        </Flex>
        <Flex value={1} align="center" justify="end" direction="row">
          <Icon
            name="favorite_inactive"
            onPress={() => {}}
            containerStyle={[st.mr5, st.pd7]}
            style={[{ width: 20, height: 15 }]}
          />
          <Icon name="more" onPress={() => {}} containerStyle={[st.pd7]} style={[{ width: 20, height: 15 }]} />
        </Flex>
      </Flex>
    </Touchable>
  );
}

export default TrackCard;
