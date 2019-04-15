import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { Flex, Text, Touchable, Button, VokeIcon } from '../common';
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
        <Flex value={1}>
          <Text> 8 part series</Text>
        </Flex>
        <Flex value={1} align="center" justify="center">
          {onInviteFriend ? (
            <Flex
              direction="row"
              style={[
                st.bgBlack,
                st.op50,
                st.br1,
                st.ph6,
                st.pl4,
                { paddingVertical: 4 },
                st.mb6,
              ]}
              align="center"
              justify="center"
            >
              <Text
                style={[st.bold, { letterSpacing: 2, fontSize: 10 }, st.mr6]}
              >
                STARTED
              </Text>
              <VokeIcon name="play" size={16} />
            </Flex>
          ) : null}
          <Text style={[st.fs6, st.bold]}>
            {(item.name || '').toUpperCase()}
          </Text>
          <Text style={[st.fs(24), st.light, st.tac]} numberOfLines={2}>
            {item.slogan}
          </Text>
        </Flex>
        {onInviteFriend ? (
          <Flex value={1} justify="end">
            <Button
              text="Invite a Friend"
              onPress={onInviteFriend}
              style={[
                st.bgOrange,
                st.mb4,
                st.ph3,
                st.pv6,
                st.bw0,
                st.br0,
                st.br3,
                st.aic,
              ]}
            />
          </Flex>
        ) : (
          <Flex value={1} />
        )}
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
