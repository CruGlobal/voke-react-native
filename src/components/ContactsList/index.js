
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import ContactItem from '../ContactItem';

import styles from './styles';
import { Touchable, Text } from '../common';
import theme from '../../theme';

const CONTACT_HEIGHT = 50;

// Format contacts for the section list
function formatContacts(items) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const sections = items.reduce((p, n) => {
    const letterIndex = ALPHA.findIndex((a) => n.name && a === n.name[0].toUpperCase());
    if (letterIndex) {
      n.key = n.id;
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
  //   { key: 'B', data: [{ id: '2', name: 'me', phone: [] }] },
  //   { key: 'C', data: [{ id: '3', name: 'you', phone: [] }] },
  //   { key: 'D', data: [{ id: '4', name: 'you', phone: [] }] },
  //   { key: 'E', data: [{ id: '5', name: 'you', phone: [] }] },
  //   { key: 'F', data: [{ id: '6', name: 'you', phone: [] }] },
  //   { key: 'G', data: [{ id: '7', name: 'you', phone: [] }] },
  // ];
}
class ContactsList extends Component {
  constructor(props) {
    super(props);

    this.renderHeader = this.renderHeader.bind(this);
  }

  renderHeader({ section }) {
    return (
      <Text style={styles.header}>
        {section.key}
      </Text>
    );
  }

  render() {
    const formattedSections = formatContacts(this.props.items);
    // ItemSeparatorComponent={() => <Separator />}
    return (
      <SectionList
        sections={formattedSections}
        renderSectionHeader={this.renderHeader}
        renderItem={({ item }) => (
          <Touchable key={item.id} highlight={true} onPress={() => this.props.onSelect(item)}>
            <View>
              <ContactItem item={item} />
            </View>
          </Touchable>
        )}
        getItemLayout={(data, index) => ({
          length: CONTACT_HEIGHT,
          offset: CONTACT_HEIGHT * index,
          index,
        })}
        initialNumToRender={10}
      />
    );
  }
}

ContactsList.propTypes = {
  items: PropTypes.array.isRequired, // Redux
};

export default ContactsList;
