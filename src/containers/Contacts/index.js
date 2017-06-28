import React, { Component } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import { iconsMap } from '../../utils/iconMap';
import styles from './styles';
import { getContacts, searchContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme';

import { Flex, Icon } from '../../components/common';
import ContactsList from '../../components/ContactsList';
import SearchBarIos from '../../components/SearchBarIos';


function setButtons() {
  if (Platform.OS === 'android') {
    return {
      rightButtons: [{
        id: 'searchView',
        icon: iconsMap['md-search'],
      }],
    };
  }
  return {};
}
class Contacts extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: Platform.OS !== 'android',
  };
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      searchText: '',
      isLoading: true,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons(this.props.dispatch, this.props.navigatePush));
  }

  getContacts() {
    this.props.dispatch(getContacts()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  onNavigatorEvent(event) {
    if (event.id === 'didAppear') {
      this.getContacts();
    } else if (event.id === 'searchQueryChange') {
      const text = event.query || '';
      this.setState({ searchText: text });
      this.search(text);
    }
  }

  search(text) {
    if (!text) {
      this.setState({ searchResults: [] });
      return;
    }
    this.props.dispatch(searchContacts(text)).then((results) => {
      this.setState({ searchResults: results });
    });
  }

  changeText(text) {
    this.setState({ searchText: text });
    this.search(text);
  }

  renderIOSSearch() {
    if (Platform.OS === 'android') return null;
    return (
      <SearchBarIos onChange={this.changeText} value={this.state.searchText}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderIOSSearch()}
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
