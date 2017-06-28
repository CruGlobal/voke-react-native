import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import styles from './styles';
import { getContacts, searchContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme';

import { Flex } from '../../components/common';
import ContactsList from '../../components/ContactsList';

class Contacts extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      searchText: '',
      isLoading: true,
    };

    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
  }
  
  componentDidMount() {
    // TODO: Make sure the transition is complete before loading the contacts
    this.timeout = setTimeout(() => {
      this.props.dispatch(getContacts()).then(() => {
        this.setState({ isLoading: false });
      });
    }, 1000);
  }

  componentWillUnmount() {
    // Always clear timeout when we unmount
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
  

  search(text) {
    this.props.dispatch(searchContacts(text)).then((results) => {
      this.setState({ searchResults: results });
    });
  }

  changeText(text) {
    this.setState({ searchText: text });
    this.search(text);
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Flex style={styles.inputWrap}>
          <TextInput
            value={this.state.searchText}
            placeholder="Search"
            placeholderTextColor={COLORS.GREY}
            style={styles.searchBox}
            autoCorrect={true}
            onChangeText={this.changeText}
          />
        </Flex>
        <ContactsList
          items={this.state.searchText ? this.state.searchResults : this.props.all}
          onSelect={(contact) => {
            console.warn('selected', contact);
          }}
        />
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Contacts.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(Contacts);
