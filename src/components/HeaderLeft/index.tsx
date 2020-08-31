import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';

import styles from './styles';

function HeaderLeft({ hasBack = false, resetTo = null }) {
  const navigation = useNavigation();

  const goBack = (): void => {
    if (hasBack) {
      if (resetTo) {
        navigation.reset({
          index: 0,
          routes: [{ name: resetTo }],
        });
      } else {
        // navigation.goBack()
        // Get the index of the route to see if we can go back.
        const { index } = navigation.dangerouslyGetState();
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
          <View style={styles.backIconContainer} onPress={goBack}>
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
