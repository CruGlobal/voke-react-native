import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';

import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';
import st from '../../st';
import theme from '../../theme';

function HeaderLeft({ hasBack = false, resetTo = null }) {
  const navigation = useNavigation();

  const goBack = () => {
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
      <Touchable
        style={[
          {
            // Extra padding to make taps more responsive.
            paddingTop: 6,
            paddingLeft: 16,
            paddingRight: 8,
            paddingBottom: 8,
          },
        ]}
        onPress={() => goBack()}
      >
        {hasBack ? (
          <View
            style={[
              {
                width: 38,
                height: 38,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
              },
            ]}
            onPress={() => goBack()}
          >
            <VokeIcon
              name="chevron-back-outline"
              style={[
                {
                  fontSize: 18,
                  marginTop: 1,
                  marginLeft: -35,
                  color: 'rgba(255,255,255,0.9)',
                },
              ]}
            />
          </View>
        ) : (
          <VokeIcon
            name="menu"
            style={[
              {
                fontSize: 26,
                marginTop: 1,
                marginLeft: 6,
                color: theme.colors.secondary,
              },
            ]}
          />
        )}
      </Touchable>
    </Flex>
  );
}

export default HeaderLeft;
