import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { FlatList, Flex, Touchable, Text, Separator, Image } from '../common';
import SafeArea from '../SafeArea';
import st from '../../st';
import CRU from '../../../images/cru.jpg';
import SU from '../../../images/scriptureUnion.png';
import JF from '../../../images/jesusFilm.png';
import IAS from '../../../images/iAmSecond.png';
import OH from '../../../images/oneHope.png';
import YS from '../../../images/youthSpecialties.png';

class SettingsList extends Component {
  renderRow = ({ item }) => {
    return (
      <Touchable highlight={true} activeOpacity={0.6} onPress={item.onPress}>
        <Flex style={styles.row} direction="row" align="center">
          <Text style={styles.link}>{item.name}</Text>
        </Flex>
      </Touchable>
    );
  };

  renderFooter = () => {
    return (
      <Flex
        direction="column"
        style={[st.pd5, st.bw1, st.borderTransparent, st.btLightGrey]}
      >
        <Text style={[st.charcoal, st.fs4, st.pl6]}>Our Partners</Text>
        <Flex direction="row" align="center" justify="center">
          <Image
            source={SU}
            style={[{ width: 160, height: 150 }]}
            resizeMode="contain"
          />
          <Image
            source={JF}
            style={[{ width: 160, height: 150, marginLeft: 25 }]}
            resizeMode="contain"
          />
        </Flex>
        <Flex direction="row" align="center" justify="center">
          <Image
            source={OH}
            style={[{ width: 160, height: 150 }]}
            resizeMode="contain"
          />
          <Image
            source={YS}
            style={[{ width: 160, height: 150, marginLeft: 25 }]}
            resizeMode="contain"
          />
        </Flex>
        <Flex direction="row" align="center" justify="center">
          <Image
            source={IAS}
            style={[{ width: 160, height: 150 }]}
            resizeMode="contain"
          />
          <Image
            source={CRU}
            style={[{ width: 160, height: 150, marginLeft: 25 }]}
            resizeMode="contain"
          />
        </Flex>
      </Flex>
    );
  };

  render() {
    return (
      <SafeArea style={[st.f1, st.bgWhite]}>
        <FlatList
          initialNumToRender={20}
          data={this.props.items}
          ItemSeparatorComponent={() => (
            <Separator style={styles.settingsSeparator} />
          )}
          renderItem={this.renderRow}
          keyExtractor={item => item.name.replace(/\s/gi, '')}
          style={[st.f1]}
          contentContainerStyle={styles.content}
          removeClippedSubviews={false}
          ListFooterComponent={() => this.renderFooter()}
        />
      </SafeArea>
    );
  }
}

SettingsList.propTypes = {
  items: PropTypes.array.isRequired,
};

export default translate()(SettingsList);
