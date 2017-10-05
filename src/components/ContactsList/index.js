
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList, Platform, KeyboardAvoidingView, Dimensions, Keyboard } from 'react-native';
import ContactItem from '../ContactItem';

import styles from './styles';
import { Touchable, Text, Flex } from '../common';
// import theme from '../../theme';

const CONTACT_HEIGHT = 50;
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

// Format contacts for the section list
function formatContacts(items) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const sections = items.reduce((p, n) => {
    const letterIndex = ALPHA.findIndex((a) => {
      if (Platform.OS === 'ios' && n.lastNameLetter) {
        return a === n.lastNameLetter;
      } else {
        return n.firstNameLetter && a === n.firstNameLetter;
      }
    });
    if (letterIndex >= 0) {
      if (p[letterIndex]) {
        p[letterIndex].data.push(n);
      } else {
        p[letterIndex] = {
          data: [n],
          key: ALPHA[letterIndex],
        };
      }
    }
    return p;
  }, []).filter((c) => !!c);
  return sections;
  // return [
  //   { key: 'A', data: [{ id: '1', name: 'bryan', phone: [] }, { id: 'a1', name: 'bryan1', phone: [] }, { id: 'a2', name: 'bryan2', phone: [] }] },
  //   { key: 'B', data: [{ id: '2', name: 'me', phone: [], isVoke: true }] },
  //   { key: 'C', data: [{ id: '3', name: 'you', phone: [], isVoke: true }] },
  //   { key: 'D', data: [{ id: '4', name: 'you', phone: [] }] },
  //   { key: 'E', data: [{ id: '5', name: 'you', phone: [] }] },
  //   { key: 'F', data: [{ id: '6', name: 'you', phone: [] }] },
  //   { key: 'G', data: [{ id: '7', name: 'you', phone: [] }] },
  // ];
}
class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardShown: false,
      height: 0,
      sections: formatContacts(props.items),
    };

    this.renderHeader = this.renderHeader.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items.length !== this.props.items.length) {
      this.setState({ sections: formatContacts(nextProps.items) });
    }
  }
  

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }
  }
  
  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
    }
  }

  keyboardDidShow(e) {
    this.setState({keyboardShown: true, height: e.endCoordinates.height});
  }

  keyboardDidHide() {
    this.setState({keyboardShown: false, height: 0});
  }

  renderHeader({ section }) {
    return (
      <Text style={styles.header}>
        {section.key}
      </Text>
    );
  }

  renderItem({ item }) {
    const { isInvite, onSelect } = this.props;
    return (
      <Touchable highlight={!isInvite} activeOpacity={isInvite ? 1 : 0.6} disabled={item.isVoke && isInvite} onPress={isInvite ? undefined : () => onSelect(item)}>
        <View>
          <ContactItem isInvite={isInvite} onButtonPress={!isInvite ? (() => {}) : () => onSelect(item)} item={item} />
        </View>
      </Touchable>
    );
  }

  render() {
    const { items } = this.props;
    // Don't do a length check, it can be taxing on large arrays
    if (!items[0]) {
      return (
        <Flex align="center" justify="center">
          <Text style={styles.noResultsText}>No results to display</Text>
        </Flex>
      );
    }
    // ItemSeparatorComponent={() => <Separator />}
    return (
      <View style={{paddingBottom: Platform.OS === 'ios' ? this.state.height + 50 : undefined}}>
        <SectionList
          initialNumToRender={40}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          keyboardShouldPersistTaps={Platform.OS === 'android' ? 'handled' : 'always'}
          sections={this.state.sections}
          renderSectionHeader={this.renderHeader}
          renderItem={this.renderItem}
          getItemLayout={(data, index) => ({
            length: CONTACT_HEIGHT,
            offset: CONTACT_HEIGHT * index,
            index,
          })}
        />
      </View>
    );
  }
}

ContactsList.propTypes = {
  items: PropTypes.array.isRequired, // Redux
  isInvite: PropTypes.bool,
};

export default ContactsList;
