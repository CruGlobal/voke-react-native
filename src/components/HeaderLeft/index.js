import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';
import st from '../../st';


function HeaderLeft({ hasBack = false }) {
  const navigation = useNavigation();
  return (
    <Flex value={1} justify="center">
        <Touchable
          style={[{
            // Extra padding to make taps more responsive.
            paddingTop: 6,
            paddingLeft: 16,
            paddingRight: 8,
            paddingBottom: 8,
          }]}
          onPress={() => ( hasBack ? navigation.goBack() : navigation.navigate('Menu') )}
        >
          {hasBack ? (
          <View
            style={[{
              backgroundColor:'rgba(0,0,0,0.3)',
              width: 38,
              height: 38,
              borderRadius: 99,
              justifyContent:'center',
              alignItems:'center',
              padding:0,
            }]}
            onPress={() => navigation.goBack()}
          >
            <VokeIcon
              name="chevron-back-outline"

              style={[
              {
                fontSize: 16,
                marginTop: 1,
                marginLeft: -4,
                color: 'rgba(255,255,255,0.9)',
              }]}
            />
          </View>
          ) : (
            <VokeIcon
              name="menu-outline"

              style={[
              {
                fontSize: 24,
                marginTop: 1,
                marginLeft: 6,
                color: 'rgba(255,255,255,0.9)',
              }]}
            />
          )}
        </Touchable>
    </Flex>
  );
}

export default HeaderLeft;
