import React, { Component } from 'react';
import { View, Platform, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { openSettingsAction } from '../../actions/auth';

import Analytics from '../../utils/analytics';
import { vokeIcons } from '../../utils/iconMap';
import styles from './styles';
// import { toastAction } from '../../actions/auth';
import { searchContacts, getContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/nav';
import Permissions from '../../utils/permissions';
import { Button, Flex } from '../../components/common';
import CONSTANTS, { SHOW_SHARE_MODAL } from '../../constants';

import ApiLoading from '../ApiLoading';
import ShareModal from '../ShareModal';
import Modal from '../Modal';
import Header, { HeaderIcon } from '../Header';
import AndroidSearchBar from '../../components/AndroidSearchBar';
import ContactsList from '../../components/ContactsList';
import SearchBarIos from '../../components/SearchBarIos';


class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      searchResults: [],
      searchText: '',
      keyboardVisible: false,
      showSearch: false,
      isSearching: false,
      permission: props.isInvite ? Permissions.NOT_ASKED : Permissions.AUTHORIZED,
    };

    this.refreshContacts = this.refreshContacts.bind(this);
    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
    this.handleGetContacts = this.handleGetContacts.bind(this);
    this.handleDismissPermission = this.handleDismissPermission.bind(this);
    this.handleCheckPermission = this.handleCheckPermission.bind(this);
    this.checkContactsStatus = this.checkContactsStatus.bind(this);
    this.handleAllowContacts = this.handleAllowContacts.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentWillMount() {
    if (this.props.isInvite) {
      // this.props.navigator.setTitle({ title: 'Invite a Friend' });
    }
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

  }

  componentDidMount() {
    Analytics.screen('Contacts');
    if (this.props.isInvite) {
      this.checkContactsStatus();
    }
  }

  componentWillUnmount() {
    // Make sure to hide the share modal whenever the contacts page goes away
    this.props.dispatch({ type: SHOW_SHARE_MODAL, bool: false });
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  onNavigatorEvent(event) {
    if (event.id === 'search') {
      // Only show search box if the permissions are authorized
      if (this.state.permission === Permissions.AUTHORIZED) {
        this.setState({ showSearch: !this.state.showSearch });
      }
    }
    // Handle the event when some clicks back while the share modal is up
    if ((event.type === 'NavBarButtonPress' && event.id === 'back') || event.id === 'backPress') {
      if (this.props.isShareModalVisible && this.props.shareModalCancel) {
        this.props.shareModalCancel();
      } else {
        this.props.navigateBack();
      }
    }
  }

  handleBack() {
    if (this.props.isShareModalVisible && this.props.shareModalCancel) {
      this.props.shareModalCancel();
    } else {
      this.props.navigateBack();
    }
  }

  keyboardDidShow() {
    this.setState({keyboardVisible: true});
    // LOG(this.state.keyboardVisible);
    if (this.props.shareModalVisible) {
      Keyboard.dismiss();
    }
  }

  keyboardDidHide() {
    this.setState({keyboardVisible: false});
  }


  componentWillReceiveProps() {
    if (this.state.keyboardVisible) {
      Keyboard.dismiss();
    }
  }

  handleCheckPermission(permission) {
    // LOG('permission', permission);
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      this.setState({ showPermissionModal: true });
      // Navigation.showModal({
      //   screen: 'voke.Modal',
      //   animationType: 'fade',
      //   passProps: {
      //     getContacts: this.handleGetContacts,
      //     onDismiss: this.handleDismissPermission,
      //   },
      //   navigatorStyle: {
      //     screenBackgroundColor: 'rgba(0, 0, 0, 0.3)',
      //   },
      //   // Stop back button from closing modal https://github.com/wix/react-native-navigation/issues/250#issuecomment-254186394
      //   overrideBackPress: true,
      // });
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

  refreshContacts() {
    this.setState({
      refreshing: true,
      searchResults: [],
      searchText: '',
      isSearching: false,
    });
    this.props.dispatch(getContacts(true)).then(() => {
      this.setState({ refreshing: false });
    }).catch(() => {
      this.setState({ refreshing: false });
    });
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
      this.setState({ searchResults: [], isSearching: false });
      return;
    }
    this.setState({ isSearching: true });
    this.props.dispatch(searchContacts(text)).then((results) => {
      this.setState({ searchResults: results, isSearching: false });
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
    const { permission, showSearch } = this.state;
    const isAuthorized = permission === Permissions.AUTHORIZED;
    return (
      <View style={styles.container}>
        <Header
          left={
            CONSTANTS.IS_ANDROID ? (
              <HeaderIcon
                icon="close"
                onPress={this.handleBack} />
            ) : (
              <HeaderIcon
                image={vokeIcons['back']}
                onPress={this.handleBack} />
            )
          }
          right={
            CONSTANTS.IS_ANDROID ? (
              <HeaderIcon
                icon="search"
                onPress={() => this.setState({ showSearch: !showSearch })} />
            ) : undefined
          }
          title={this.props.isInvite ? 'Invite a Friend' : 'Contacts'}
          light={true}
          shadow={false}
        />
        {this.renderSearch()}
        {
          isAuthorized ? (
            <ContactsList
              isSearching={this.state.isSearching}
              items={this.state.searchText ? this.state.searchResults : this.props.all}
              onSelect={this.props.onSelect}
              isInvite={this.props.isInvite}
              onRefresh={this.refreshContacts}
              refreshing={this.state.refreshing}
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
              text={'Fetching your contacts - and because you are so popular, I need up to 30 seconds'}
            />
          ) : null
        }
        <ApiLoading />
        {
          isAuthorized ? <ShareModal /> : null
        }
        {
          this.state.showPermissionModal ? (
            <Modal
              onClose={() => this.setState({ showPermissionModal: false })}
              getContacts={this.handleGetContacts}
              onDismiss={this.handleDismissPermission}
            />
          ) : null
        }
      </View>
    );
  }
}


// Check out actions/nav.js to see the prop types and mapDispatchToProps
Contacts.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
  video: PropTypes.string,
  isInvite: PropTypes.bool,
  isLoading: PropTypes.bool, // Redux
};
const mapStateToProps = ({ contacts }, { navigation }) => ({
  ...(navigation.state.params || {}),
  all: contacts.all,
  allLength: contacts.all.length,
  isLoading: contacts.isLoading,
  isShareModalVisible: contacts.showShareModal,
  shareModalCancel: contacts.shareModalProps.onCancel,
});

export default connect(mapStateToProps, nav)(Contacts);
