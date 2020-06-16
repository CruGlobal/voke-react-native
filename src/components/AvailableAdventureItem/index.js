import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import lodash from 'lodash';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';

function AvailableAdventureItem({
  item = {
    image: { medium: '' },
    total_steps: 0,
    total_shares: 0,
    name: '',
    slogan: '',
  },
}) {
  const myAdventures = useSelector(({ data }) => data.myAdventures.byId);
  const navigation = useNavigation();
  const [shouldInviteFriend, setShouldInviteFriend] = useState(
    lodash.find( myAdventures,
     // TODO try to optimize
     function(adv) { return adv.organization_journey_id === item.id; }
    ),
  );

  useEffect(() => {
    setShouldInviteFriend(
      lodash.find( myAdventures,
        // TODO try to optimize
        function(adv) { return adv.organization_journey_id === item.id; }
      ),
    );
  }, [myAdventures]);

  return (
    <Touchable
      onPress={() =>
        navigation.navigate('AdventureAvailable', {
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
            { backgroundColor: 'rgba(0, 0, 0, 0.35)' },
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
                style={[
                  st.bold,
                  st.white,
                  { letterSpacing: 2, fontSize: 10 },
                  st.mr6,
                ]}
              >
                {'started'.toUpperCase()}
              </Text>
              <VokeIcon name="play-full" size={16} />
            </Flex>
          ) :  <Text style={[st.fs12, st.bold, st.white]}>
          ADVENTURE
        </Text>}
          <Text style={[st.fs20, st.white]}>
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
              onPress={ () =>
                navigation.navigate('AdventureName', {
                  item: {
                    id: item.id
                  },
                  withGroup: false,
                })
              }
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
              <Text style={[st.white, { lineHeight: 20 }]}>Invite a Friend</Text>
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
            <VokeIcon
                name="copy"
                style={[ { height: 20, width: 20 }]}
              />
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
              {item.total_shares || 0} {'shares'.toUpperCase()}
            </Text>
            {shouldInviteFriend ? null : (
              <Button
                type="transparent"
                isAndroidOpacity
                onPress={ () =>
                  navigation.navigate('AdventureName', {
                    item: {
                      id: item.id
                    },
                    withGroup: false,
                  })
                }
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
