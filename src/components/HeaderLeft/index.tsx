import React from 'react';
import { NavigationActions, CommonActions,  useNavigation } from '@react-navigation/native';
import * as RootNavigation from '../../RootNavigation';
import { View, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';

import styles from './styles';

function HeaderLeft({ hasBack = false, resetTo = '' }) {
  const navigation = useNavigation();
  const adventureId = useSelector(
    ({ info }: any) => info?.currentScreen?.data?.adventureId,
  );

  const goBack = (): void => {
    if (hasBack) {
      const { index, routes } = navigation.dangerouslyGetState();
      if (resetTo) {
        if (
          index > 0 &&
          routes.length &&
          routes[routes.length - 2]?.name === resetTo
        ) {
          // .goBack is 2s. faster than .reset(), so if possible use it.
          navigation.goBack();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: resetTo }],
          });
        }
      } else {
        // Get the index of the route to see if we can go back.
        if (index > 0) {
          navigation.goBack();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoggedInApp' }],
          });
        }
      }
    } else {
      navigation.navigate('Menu');
    }
  };

  return (
    <Flex value={1} justify="center">
      <Touchable style={styles.touchable} onPress={goBack}>
        {hasBack ? (
          <View style={styles.backIconContainer}>
            <VokeIcon name="chevron-back-outline" style={styles.backIcon} />
          </View>
        ) : (
          <VokeIcon name="menu" style={styles.menuIcon} />
        )}
      </Touchable>
    </Flex>
  );
}

export default HeaderLeft;
