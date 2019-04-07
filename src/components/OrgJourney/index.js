import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable, Button } from '../common';
import st from '../../st';

export default function OrgJourney({ onPress, item, onInviteFriend }) {
  return (
    <Touchable onPress={() => onPress(item)}>
      <Flex
        align="center"
        justify="center"
        style={[st.shadow, st.h(200), st.br5, st.ph4, st.mh4, st.mv6]}
      >
        {/* source={{
        uri:
          'https://www.tripsavvy.com/thmb/qSHJzk19KBq_LAuGDTriGhElfL8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/GlacierNationalParkMontana-FengWeiPhotography-Getty-5711489a3df78c3fa2b5d2a2.jpg',
      }} */}
        <Image
          source={{ uri: item.image.medium }}
          style={[st.absfill, st.br5]}
        />
        <View
          style={[
            st.absfill,
            st.br5,
            { backgroundColor: 'rgba(0, 0, 0, 0.6)' },
          ]}
        />
        <Flex value={1} />
        <Flex value={1} align="center" justify="center">
          <Text style={[st.fs6, st.bold]}>
            {(item.name || '').toUpperCase()}
          </Text>
          <Text style={[st.fs(24), st.light, st.tac]} numberOfLines={2}>
            {item.slogan}
          </Text>
        </Flex>
        <Flex value={1} justify="end">
          <Button
            text="Invite a Friend"
            onPress={onInviteFriend}
            style={[
              st.bgOrange,
              st.mb5,
              st.ph3,
              st.pv6,
              st.bw0,
              st.br0,
              st.br3,
              st.aic,
            ]}
          />
        </Flex>
      </Flex>
    </Touchable>
  );
}
OrgJourney.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};
