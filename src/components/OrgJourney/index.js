import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import TO_CHAT from '../../../images/newShare.png';

import { Flex, Text, Touchable, Button, VokeIcon, Icon } from '../common';
import st from '../../st';

function OrgJourney({
  t,
  onPress,
  item,
  onInviteFriend,
  onInviteFriendFirstTime,
}) {
  item = item || {};
  const newImage = (item.image || {}).medium || undefined;
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
        <Image source={{ uri: newImage }} style={[st.absfill, st.br5]} />
        <View
          style={[
            st.absfill,
            st.br5,
            { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          ]}
        />
        <Flex value={1} />

        <Flex value={2} align="center" justify="center">
          {onInviteFriend ? (
            <Flex
              direction="row"
              style={[
                st.br1,
                st.ph6,
                st.pl4,
                { paddingVertical: 4, backgroundColor: 'rgba(0,0,0,0.5)' },
                st.mb6,
              ]}
              align="center"
              justify="center"
            >
              <Text
                style={[st.bold, { letterSpacing: 2, fontSize: 10 }, st.mr6]}
              >
                {t('started').toUpperCase()}
              </Text>
              <VokeIcon name="play" size={16} />
            </Flex>
          ) : null}
          <Text style={[st.fs6, st.bold]}>
            {(item.name || '').toUpperCase()}
          </Text>
          {item.slogan ? (
            <Text style={[st.fs(24), st.light, st.tac]} numberOfLines={2}>
              {item.slogan}
            </Text>
          ) : null}
        </Flex>
        {onInviteFriend ? (
          <Flex value={1} justify="end">
            <Button
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
                st.jcc,
                st.fdr,
              ]}
            >
              <VokeIcon
                name="shareArrow"
                type="image"
                style={[st.mr5, { height: 20, width: 20, marginBottom: 2 }]}
              />
              <Text style={[{ lineHeight: 20 }]}>{t('inviteFriend')}</Text>
            </Button>
          </Flex>
        ) : (
          <Flex value={1} />
        )}
        <Flex
          justify="between"
          align="start"
          direction="row"
          self="stretch"
          value={0.5}
          style={[
            {
              marginLeft: -15,
              marginRight: -15,
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            st.ph4,
            st.pt6,
            st.brbl5,
            st.brbr5,
          ]}
        >
          <Flex direction="row">
            <Icon style={[st.white, st.mr6]} name="filter-none" size={14} />
            <Text style={[st.bold, { letterSpacing: 2, fontSize: 10 }]}>
              {item.total_steps}-{t('partSeries').toUpperCase()}
            </Text>
          </Flex>
          <Flex direction="row">
            <Text style={[st.bold, { letterSpacing: 2, fontSize: 10 }]}>
              {item.total_shares || 0} {t('share').toUpperCase()}S
            </Text>
            {onInviteFriend ? null : (
              <Button
                type="transparent"
                isAndroidOpacity={true}
                onPress={onInviteFriendFirstTime}
                activeOpacity={0.6}
                touchableStyle={[{ marginTop: -20 }, st.ml5]}
              >
                <Image
                  resizeMode="cover"
                  source={TO_CHAT}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              </Button>
            )}
          </Flex>
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

export default translate('orgJourney')(OrgJourney);
