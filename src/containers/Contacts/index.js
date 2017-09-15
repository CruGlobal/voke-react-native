import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { openSettingsAction } from '../../actions/auth';
import { Navigation } from 'react-native-navigation';

import Analytics from '../../utils/analytics';
// import { iconsMap } from '../../utils/iconMap';
import styles from './styles';
// import { toastAction } from '../../actions/auth';
import { searchContacts, getContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import Permissions from '../../utils/permissions';
import { Button, Flex } from '../../components/common';

import ContactsList from '../../components/ContactsList';
import SearchBarIos from '../../components/SearchBarIos';


function setButtons() {
  // TODO: Implement a search bar for android using a custom navigation title
  // if (Platform.OS === 'android') {
  //   return {
  //     rightButtons: [{
  //       id: 'searchView',
  //       icon: iconsMap['md-search'],
  //     }],
  //   };
  // }
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
      permission: '',
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.handleCheckPermission = this.handleCheckPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.handleAllowContacts = this.handleAllowContacts.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    if (this.props.isInvite) {
      this.props.navigator.setTitle({ title: 'Invite a Friend' });
    }
  }

  handleCheckPermission(permission) {
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      Navigation.showModal({
        screen: 'voke.Modal', // unique ID registered with Navigation.registerScreen
        animationType: 'slide-up', // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
        passProps: {
          getContacts: this.handleGetContacts,
          onDismiss: this.handleDismissPermission,
        },
        navigatorStyle: {
          screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
      });
    } else {
      this.setState({ isLoading: false });
      // Change screen
    }
  }

  checkContactsStatus() {
    Permissions.checkContacts().then(this.handleCheckPermission);
  }

  handleDismissPermission() {
    this.setState({ isLoading: false });
    // permission not asked yet
  }

  handleGetContacts() {
    this.props.dispatch(getContacts()).then(() => {
      this.setState({ isLoading: false, permission: Permissions.AUTHORIZED });
    }).catch(() => {
      this.setState({ isLoading: false, permission: Permissions.DENIED });
      LOG('contacts caught');
      //change screen
    });
  }


  handleAllowContacts() {
    if (Platform.OS === 'android') {
      this.handleGetContacts();
    } else if (this.state.permission === Permissions.DENIED) {
      // On iOS, open settings
      this.props.dispatch(openSettingsAction());
    } else {
      this.checkContactsStatus();
    }
  }

  componentDidMount() {
    Analytics.screen('Contacts');
    if (this.props.isInvite) {
      this.checkContactsStatus();
    }
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
        {
          this.state.permission === 'AUTHORIZED' ? (
            <ContactsList
              items={this.state.searchText ? this.state.searchResults : this.props.all}
              onSelect={(c) => {
                this.props.onSelect(c);
              }}
              isInvite={this.props.isInvite}
            />
          ) : (
            <Flex align="center" style={{paddingTop: 30}}>
              <Button
                onPress={this.handleAllowContacts}
                text="Allow Contacts"
                style={styles.randomButton}
                buttonTextStyle={styles.randomText}
              />
            </Flex>
          )
        }
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
