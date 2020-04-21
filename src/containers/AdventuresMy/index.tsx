import React, { useState, useEffect } from 'react';
import hash from 'object-hash';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { startupAction } from '../../actions/auth';
import { FlatList, View } from 'react-native';
import { useMount, isEqualObject } from '../../utils';

import BotTalking from '../../components/BotTalking';
import styles from './styles';

import {
  getAvailableAdventures,
  getMyAdventures,
  getAdventuresInvitations,
} from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import MyAdventureItem from '../../components/MyAdventureItem';
import Triangle from '../../components/Triangle';
import AdventuresActions from '../AdventuresActions';

const AdventuresMy: React.FC = (): React.ReactElement => {
  // var z0 = performance.now()

  const dispatch = useDispatch();
  const me = useSelector(({ auth }: RootState) => auth.user);
  const myAdventures = useSelector(({ data }: RootState) => data.myAdventures);
  const adventureInvitations = useSelector(
    ({ data }: RootState) => data.adventureInvitations,
  );
  const [dataHash, setDataHash] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Initial loading.
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh.

  const getCurrentDataHash = (): string => {
    // var t0 = performance.now()
    console.log( "adventureInvitations:" ); console.log( adventureInvitations );
    console.log( "myAdventures:" ); console.log( myAdventures );
    hashedData = hash.sha1([].concat(adventureInvitations, myAdventures));
    console.log( "🔑 hashedData>>>>>>>>>:\n", hashedData );
    // var t1 = performance.now()
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    return hashedData;
  }

  /* const updateAdventures = async (): Promise<void> => {
    console.log( "updateAdventures:🔁🔁🔁🔁🔁" );
    setIsLoading(true);
    // if (myAdventures.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getMyAdventures());
    // }
    // if (adventureInvitations.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getAdventuresInvitations());
    // await setTimeout(function(){ console.log("Hello"); }, 9000);
    setIsLoading(false);

    // setDataHash( getCurrentDataHash() );
  }
 */
  const updateAdventures = async (): Promise<void> => {
    console.log( "updateAdventures:🔁🔁🔁🔁🔁" );
    setIsLoading(true);
    // if (myAdventures.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getMyAdventures());
    // then(
      console.log('🩳getMyAdventures')
    // );
    // }
    // if (adventureInvitations.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getAdventuresInvitations());
    console.log('🦺getAdventuresInvitations')

    console.log( "updateAdventures:🔁🔁🔁🔁🔁 COMPLETED" );
    setIsLoading(false);

    // setDataHash( getCurrentDataHash() );
  }
  const refreshData = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      setIsRefreshing(true);
      // await dispatch(updateAdventures());
    } finally {
      setIsRefreshing(false);
    }
  }

  // Actions to run once component mounted.
  /* useMount(() => {
    console.log( 'AdventuresMy: useMount >>>>>>>>>>>>>' );
    // Check notifications permission and setup sockets.
    // dispatch(startupAction());
    // Load my adventures + invites. Note: async function can't be part of hook!
    // updateAdventures();
  });
 */
  useEffect(() => {
    console.log( 'AdventuresMy: useEffect >>>>>>>>>>>>>' );
    // var y0 = performance.now()

    // Check notifications permission and setup sockets.
    dispatch(startupAction());

    // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();

    // var z1 = performance.now()
    // console.log( "⏱ Call to useEffect took " + (z1 - z0) + " milliseconds.")
    /* Performance:
     * 36ms with empty component/screen
     * 150ms with <FlatList>
     */
  },[])

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    React.useCallback(() => {
      //TODO: refresh data if users comes back here from new code generating screen.
      //TODO: refresh data if comes back from adventure and interacted there (left comment/went to the next).
      // if CREATE_ADVENTURE_STEP_MESSAGE
      // if store.data.myAdventures.[0...xx].progress changed
      //
      // OR hash data from:
      // store.data.myAdventures,
      // store.data.AdventureInvitations,
      // - update the view if hash changed.

      // Also consider:
      // store.data.availableAdventures,
      // store.data.AdventureSteps
      // store.data.AdventureMessages


      // Do something when the screen is focused
      console.log( '>>>>>>> Screen focused <<<<<<<<' );

      // isEqualObject !!!!!!!!!!!!!!!!!!!!!!!!!!!

      /* const newHash = getCurrentDataHash();
      if ( newHash === dataHash ) {
        console.log( "🔑 🛑 NOTHING CHANGED:", dataHash, newHash );
      } else {
        console.log( "🔑 ✅ DATA CHANGED:", dataHash, newHash );
      } */

      return () => {
        console.log( 'xxxxxxxx Screen UNfocused xxxxxxxx' );
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <>
    <FlatList
      ListHeaderComponent={ <AdventuresActions />}
      data={[].concat(adventureInvitations, myAdventures)}
      renderItem={(props): JSX.Element => <MyAdventureItem {...props} />}
      style={styles.AdventuresList}
      onRefresh={() => refreshData()}
      refreshing={isRefreshing}
      ListEmptyComponent={<BotTalking>
        {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
      </BotTalking>}
      // renderScrollComponent={(props) => (<ScrollView {...props} />)}
      // removeClippedSubviews <- DON'T ENABLE IT! CAUSING https://d.pr/pecCiO
    />
    </>
  );
};

export default AdventuresMy;
