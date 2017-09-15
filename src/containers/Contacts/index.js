import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';

import Analytics from '../../utils/analytics';
import { iconsMap } from '../../utils/iconMap';
import styles from './styles';
// import { toastAction } from '../../actions/auth';
import { searchContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

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
    tabBarHidden: true,
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
    this.props.navigator.setButtons(setButtons());
    if (this.props.isInvite) {
      this.props.navigator.setTitle({ title: 'Invite a Friend' });
    }
  }

  componentDidMount() {
    Analytics.screen('Contacts');
    // // TODO: Make the same call as SelectFriend to show a modal based on the permissions
    // if (this.props.isInvite) {
    //   Permissions.checkContacts().then((permission) => {
    //   });
    // }
  }

  onNavigatorEvent(event) {
    if (event.id === 'didAppear') {
      // this.getContacts();
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
      <SearchBarIos onChange={this.changeText} value={this.state.searchText} />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderIOSSearch()}
        <ContactsList
          items={this.state.searchText ? this.state.searchResults : this.props.all}
          onSelect={(c) => {
            this.props.onSelect(c);
            this.props.navigateBack();
          }}
        />
      </View>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Contacts.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
  video: PropTypes.string,
  isInvite: PropTypes.bool,
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  voke: contacts.voke,
});

export default connect(mapStateToProps, nav)(Contacts);
