/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { momentUtc } from '../../utils';
import styles from './styles';

const THUMBNAIL_WIDTH = 64;
const TIMER_INTERVAL = 60;

function getExpiredTime(date: string) {
  const diff = momentUtc(date).diff(moment());
  const diffDuration = moment.duration(diff);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();
  // const seconds = diffDuration.seconds();

  const str = `${days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}${
    hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''
  }${minutes >= 0 ? `${minutes} min ` : ''}`;
  return { str, isTimeExpired: diff < 0 };
}

type InviteItemProps = {
  item: {
    kind: string;
    expires_at: string;
    organization_journey: string;
    messenger_journey_id: string;
    name: string;
    code: string;
  };
};

const InviteItem = ({ item }: InviteItemProps): React.ReactElement => {
  const adventureItem = {
    code: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    name: '',
    expires_at: '',
    ...item,
  };
  const [isExpired, setIsExpired] = useState(false);
  const [time, setTime] = useState('');
  const { organization_journey, name, code } = item;
  const orgJourney = organization_journey || {};
  const orgJourneyImage = (orgJourney.image || {}).small || undefined;
  const isGroup = item.kind === 'multiple';
  const navigation = useNavigation();

  useEffect(() => {
    // TODO: make sure timeres are cleared properly of find another way.
    const interval = setInterval(() => {
      const { str, isTimeExpired } = getExpiredTime(item.expires_at);
      // Clear the interval when it is expired
      if (isExpired) {
        clearInterval(interval);
      }
      setIsExpired(isTimeExpired);
      setTime(str);
    }, TIMER_INTERVAL * 1000);
    return (): void => clearInterval(interval);
  }, []);

  return (
    <Flex style={styles.MyAdventureWrapper}>
      <Flex
        style={[styles.MyAdventureBlock, styles.MyAdventureBlockInvite]}
        direction="row"
        align="center"
        justify="start"
      >
        <Flex>
          <Image
            source={{ uri: orgJourneyImage }}
            style={[st.f1, st.w(THUMBNAIL_WIDTH), st.brbl6, st.brtl6]}
          />
        </Flex>
        <Flex
          value={1}
          direction="column"
          align="start"
          justify="start"
          style={[st.pv6, st.ph4]}
        >
          <Text numberOfLines={1} style={[st.white, st.fs4]}>
            {isGroup ? `${name}: Waiting for group` : `waiting for ${name}`}
          </Text>
          <Flex direction="column" align="start" style={[st.pb6]}>
            {!isExpired && !isGroup ? (
              <Text numberOfLines={1} style={[st.white, st.fs6]}>
                Expires in: {time}
              </Text>
            ) : (
              <Button
                text="Resend"
                onPress={(): void => {
                  //TODO: add reset functionality
                }}
                style={[
                  st.bgOrange,
                  st.ph5,
                  st.pv(2),
                  st.bw0,
                  st.br0,
                  st.br3,
                  st.aic,
                ]}
                buttonTextStyle={[st.fs6]}
              />
            )}
            <Flex direction="row">
              <Text numberOfLines={1} style={[st.white, st.fs6, st.tal]}>
                Code
              </Text>
              <Text selectable style={[st.white, st.fs6, st.bold, st.tal]}>
                {code}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Touchable
            onPress={async (): Promise<void> => {
              navigation.navigate('AdventureActive', {
                adventureId: adventureItem.messenger_journey_id,
              });
            }}
            style={[st.pd(7)]}
          >
            <Text style={[st.bold, st.white, st.fs6, st.tac]}>
              {'Get Started'.toUpperCase().split(' ').join('\n')}
            </Text>
          </Touchable>
        </Flex>
        <Flex align="center" justify="center" style={[st.tac, st.mr4, st.ml6]}>
          {isExpired ? (
            <Touchable
              onPress={(): void => {
                //TODO: add on press function here.
              }}
              style={[st.br2, st.borderWhite, st.bw1, st.pd(7)]}
            >
              <VokeIcon name="close" style={[st.white, st.fs6]} />
            </Touchable>
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default InviteItem;
