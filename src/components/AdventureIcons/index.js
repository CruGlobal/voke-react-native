import React, { Component } from 'react';
import { Image, Alert } from 'react-native';
import PropTypes from 'prop-types';
import { Touchable, Flex } from '../../components/common';
import ADVENTURE_1 from '../../../images/adventure1.png';
import ADVENTURE_2 from '../../../images/adventure2.png';
import ADVENTURE_3 from '../../../images/adventure3.png';
import LOCK from '../../../images/lockedAdventure.png';

class AdventureIcons extends Component {

  handlePress =() => {
    Alert.alert('This challenge is locked!');
  }

  render() {
    return (
      <Flex direction="row" style={{position: 'absolute', top: 0, right: 0, zIndex: 100000}}>
        <Touchable disabled={true} onPress={()=>{}} style={{marginHorizontal: 5, marginVertical: 10}}>
          <Image source={ADVENTURE_1} />
        </Touchable>
        <Touchable onPress={this.handlePress} style={{marginHorizontal: 5, marginVertical: 10}}>
          <Image source={ADVENTURE_2} />
          <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
        </Touchable>
        <Touchable onPress={this.handlePress} style={{marginHorizontal: 5, marginVertical: 10}}>
          <Image source={ADVENTURE_3} />
          <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
        </Touchable>

      </Flex>
    );
  }
}

AdventureIcons.propTypes = {

};

export default AdventureIcons;
