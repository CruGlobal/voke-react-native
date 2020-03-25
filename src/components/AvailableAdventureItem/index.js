import React from 'react';
import { View } from 'react-native';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { useSelector, useDispatch } from 'react-redux';
import { useMount } from '../../utils';
import { getMyAdventures } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';

function AvailableAdventureItem({
  item = {
    image: { medium: '' },
    total_steps: 0,
    total_shares: 0,
    name: '',
    slogan: '',
  },
}) {
  const myAdventures = useSelector(({ data }) => data.myAdventures);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useMount(() => {
    if (myAdventures.length === 0) {
      dispatch(getMyAdventures());
    }
  });

  const shouldInviteFriend = myAdventures.find(
    adventure => adventure.organization_journey_id === item.id,
  );
  return (
    <Touchable
      onPress={() =>
        navigation.navigate('AvailableAdventureModal', {
          item,
          alreadyStartedByMe: shouldInviteFriend,
        })
      }
    >
      <Flex
        align="center"
        justify="center"
        style={[st.shadow, st.h(200), st.br5, st.ph4, st.mh4, st.mv6]}
      >
        <Image
          source={{ uri: item.image.medium }}
          style={[st.absfill, st.br5]}
        />
        <View
          style={[
            st.absfill,
            st.br5,
            { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
          ]}
        />
        <Flex value={1} />
        <Flex value={2} align="center" justify="center">
          {shouldInviteFriend ? (
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
                {'started'.toUpperCase()}
              </Text>
              <VokeIcon name="play" size={16} />
            </Flex>
          ) : null}
          <Text style={[st.fs6, st.bold, st.white]}>
            {item.name.toUpperCase()}
          </Text>
          <Text
            style={[st.fs(24), st.white, st.light, st.tac]}
            numberOfLines={2}
          >
            {item.slogan}
          </Text>
        </Flex>

        {shouldInviteFriend ? (
          <Flex value={1} justify="end">
            <Button
              onPress={() => {}}
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
              <Text style={[{ lineHeight: 20 }]}>{'Invite friend'}</Text>
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
            {/* <Icon style={[st.white, st.mr6]} name="filter-none" size={14} /> */}
            <Text
              style={[st.bold, st.white, { letterSpacing: 2, fontSize: 10 }]}
            >
              {item.total_steps}-{'part series'.toUpperCase()}
            </Text>
          </Flex>
          <Flex direction="row">
            <Text
              style={[st.bold, st.white, { letterSpacing: 2, fontSize: 10 }]}
            >
              {item.total_shares || 0} {'shares'.toUpperCase()}S
            </Text>
            {shouldInviteFriend ? null : (
              <Button
                type="transparent"
                isAndroidOpacity={true}
                onPress={() => {}}
                activeOpacity={0.6}
                touchableStyle={[{ marginTop: -20 }, st.ml5]}
              >
                <VokeIcon
                  type="image"
                  name="to-chat"
                  style={{ width: 50, height: 50 }}
                />
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Touchable>
  );
}

export default AvailableAdventureItem;
