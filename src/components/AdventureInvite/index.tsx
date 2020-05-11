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
import { useSelector, useDispatch } from 'react-redux';
import useInterval from '../../utils/useInterval';
import { resendAdventureInvitation } from '../../actions/requests';

const THUMBNAIL_WIDTH = 140;

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
  inviteID: string;
};

const AdventureInvite = ({ inviteID }: InviteItemProps): React.ReactElement => {
  // const inviteItem = {
  //   code: '',
  //   conversation: {},
  //   progress: {},
  //   item: { content: { thumbnails: { small: '' } } },
  //   name: '',
  //   expires_at: '',
  //   ...item,
  // };

  const inviteItem = useSelector(({ data }) => data.adventureInvitations.byId[inviteID]);

  const [isExpired, setIsExpired] = useState(false);
  const [time, setTime] = useState('');
  const [timer, setTimer] = useState(60000); // 1 minute timer step
  const { organization_journey, name, code } = inviteItem;
  const orgJourney = organization_journey || {};
  const orgJourneyImage = (orgJourney.image || {}).small || undefined;
  const isGroup = inviteItem.kind === 'multiple';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    updateExpire();
  }, []);

  const updateExpire = () => {
    const { str, isTimeExpired } = getExpiredTime(inviteItem.expires_at);
    setIsExpired(isTimeExpired);
    setTime(str);
  }

  // Create a live expiration countdown timer.
  // Function will fire by itself after required time passes..
  useInterval(() => {
    updateExpire();
    // Clear the interval when it is expired
    if (isExpired) {
      setTimer(null);
    }
  }, timer);


  const resendInvite = async (inviteID) => {
    try {
      await dispatch(resendAdventureInvitation(inviteID));
    } finally {
      navigation.navigate('AdventureShareCode', {
        invitation: inviteItem,
        withGroup: isGroup,
        isVideoInvite: false,
      });
    }
  };

 /*  const deleteInvite = item => {
    const { t, dispatch } = this.props;
    dispatch(
      confirmAlert(
        t('areYouSureDelete', { name: item.name }),
        t('deleteCannotBeUndone'),
        async () => {
          await dispatch(deleteJourneyInvite(item.id));
          this.load();
        },
      ),
    );
  }; */

  return (
    <Flex style={styles.InviteWrapper}>
      <Touchable
        onPress={async (): Promise<void> => {
          navigation.navigate('AdventureActive', {
            adventureId: inviteItem.messenger_journey_id,
          });
        }}
      >
        <Flex
          style={[styles.InviteBlock]}
          direction="row"
          align="center"
          // justify="start"
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
            justify="center"
            style={[styles.InviteBlockContent]}
          >
            <Text numberOfLines={2} style={[st.white, st.fs4]}>
            {
              isExpired ?
                `${name}'s code expired...` :
                  isGroup ?
                    `${name}: \nWaiting for group` :
                    `Waiting for ${name} to join...`
            }
            </Text>
            <Flex value={1} direction="row" align="center" justify="between">
              <Flex value={1} direction="row" align="center" style={styles.CodeBlock}>
                <Text numberOfLines={1} style={styles.Code}>
                  Code:
                </Text>
                <Text selectable style={[st.white, st.bold]}>
                  {' ' + code}
                </Text>
              </Flex>
              <Flex>
                {!isExpired && !isGroup ? (
                  <Text numberOfLines={1} style={[st.white, st.fs6]}>
                    Expires in {time}
                  </Text>
                ) : (
                  <Button
                    onPress={()=>resendInvite(inviteID)}
                    style={styles.ButtonReset}
                    buttonTextStyle={[st.fs6]}
                  ><Text style={styles.ButtonResetLabel}>Resend</Text></Button>
                )}
              </Flex>
            </Flex>
            {/* <Flex>
              <Text style={[st.bold, st.white, st.fs6, st.tac]}>
                {'Get Started'.toUpperCase()}
              </Text>
            </Flex> */}
          </Flex>
          {isExpired ? (<Flex align="center" justify="center" style={[st.tac, st.mr4, st.ml6]}>

              <Touchable
                onPress={(): void => {
                  //TODO: add on press function here.
                }}
                style={[st.br2, st.borderWhite, st.bw1, st.pd(7)]}
              >
                <VokeIcon name="close" style={[st.white, st.fs6]} />
              </Touchable>
          </Flex>) : null}
        </Flex>
      </Touchable>
    </Flex>
  );
};

export default AdventureInvite;