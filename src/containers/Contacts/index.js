import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { openSettingsAction } from '../../actions/auth';
import { Navigation } from 'react-native-navigation';

import Analytics from '../../utils/analytics';
import { vokeIcons } from '../../utils/iconMap';
import styles from './styles';
// import { toastAction } from '../../actions/auth';
import { searchContacts, getContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import Permissions from '../../utils/permissions';
import { Button, Flex } from '../../components/common';

import ApiLoading from '../ApiLoading';
import AndroidSearchBar from '../../components/AndroidSearchBar';
import ContactsList from '../../components/ContactsList';
import SearchBarIos from '../../components/SearchBarIos';


function setButtons() {
  // TODO: Implement a search bar for android using a custom navigation title
  if (Platform.OS === 'android') {
    return {
      rightButtons: [{
        id: 'search',
        icon: vokeIcons['search'],
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
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
    tabBarHidden: true,
  };
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      searchText: '',
      showSearch: false,
      permission: props.isInvite ? Permissions.NOT_ASKED : Permissions.AUTHORIZED,
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

  componentDidMount() {
    Analytics.screen('Contacts');
    if (this.props.isInvite) {
      this.checkContactsStatus();
    }
  }

  onNavigatorEvent(event) {
    if (event.id === 'search') {
      if (this.state.permission === Permissions.AUTHORIZED) {
        this.setState({ showSearch: !this.state.showSearch });
      }
    }
  }

  handleCheckPermission(permission) {
    // LOG('permission', permission);
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      Navigation.showModal({
        screen: 'voke.Modal',
        animationType: 'fade',
        passProps: {
          getContacts: this.handleGetContacts,
          onDismiss: this.handleDismissPermission,
        },
        navigatorStyle: {
          screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        // Stop back button from closing modal https://github.com/wix/react-native-navigation/issues/250#issuecomment-254186394
        overrideBackPress: true,
      });
    } else {
      // Change screen
    }
  }

  checkContactsStatus() {
    // On older android devices, don't even do the prompts
    if (Platform.OS === 'android' && Platform.Version < 23) {
      this.handleGetContacts();
    } else {
      Permissions.checkContacts().then(this.handleCheckPermission);
    }
  }

  handleDismissPermission() {
    // permission not asked yet
  }

  handleGetContacts() {
    this.props.dispatch(getContacts()).then(() => {
      this.setState({ permission: Permissions.AUTHORIZED });
    }).catch(() => {
      this.setState({ permission: Permissions.DENIED });
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

  renderSearch() {
    if (Platform.OS === 'android') {
      if (!this.state.showSearch) return null;
      return (
        <AndroidSearchBar onChange={this.changeText} value={this.state.searchText} />
      );
    }
    return (
      <SearchBarIos onChange={this.changeText} value={this.state.searchText} />
    );
  }

  render() {
    
    const isAuthorized = this.state.permission === Permissions.AUTHORIZED;
    return (
      <View style={styles.container}>
        {this.renderSearch()}
        {
          isAuthorized ? (
            <ContactsList
              items={this.state.searchText ? this.state.searchResults : this.props.all}
              onSelect={this.props.onSelect}
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
        {
          this.props.isLoading ? (
            <ApiLoading
              force={true}
              text={'Fetching your contacts,\ngive me a few seconds'}
            />
          ) : null
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
  isLoading: PropTypes.bool, // Redux
};

const mapStateToProps = ({ contacts }) => ({
  all: contacts.all,
  // voke: contacts.voke,
  isLoading: contacts.isLoading,
});

export default connect(mapStateToProps, nav)(Contacts);
