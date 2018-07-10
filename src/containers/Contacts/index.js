import React, { Component } from 'react';
import { View, Platform, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { translate } from 'react-i18next';

import { openSettingsAction } from '../../actions/auth';
import Analytics from '../../utils/analytics';
import styles from './styles';
import { searchContacts, getContacts } from '../../actions/contacts';
import nav, { NavPropTypes } from '../../actions/nav';
import Permissions from '../../utils/permissions';
import { Button, Flex } from '../../components/common';
import { SHOW_SHARE_MODAL } from '../../constants';
import ApiLoading from '../ApiLoading';
import ShareModal from '../ShareModal';
import Modal from '../Modal';
import Header, { HeaderIcon } from '../Header';
import AndroidSearchBar from '../../components/AndroidSearchBar';
import ContactsList from '../../components/ContactsList';
import SelectNumber from '../../components/SelectNumber';
import SearchBarIos from '../../components/SearchBarIos';
import theme from '../../theme';

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
      isMultipleOpen: false,
      showPermissionModal: false,
      selectNumberContact: null,
      permission: props.isInvite
        ? Permissions.NOT_ASKED
        : Permissions.AUTHORIZED,
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
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
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

  handleBack() {
    if (this.props.isShareModalVisible && this.props.shareModalCancel) {
      this.props.shareModalCancel();
    } else {
      this.props.navigateBack();
    }
  }

  keyboardDidShow() {
    this.setState({ keyboardVisible: true });
    if (this.props.shareModalVisible) {
      Keyboard.dismiss();
    }
  }

  keyboardDidHide() {
    this.setState({ keyboardVisible: false });
  }

  componentWillReceiveProps() {
    if (this.state.keyboardVisible) {
      Keyboard.dismiss();
    }
  }

  handleCheckPermission(permission) {
    this.setState({ permission: permission });
    if (permission === Permissions.AUTHORIZED) {
      this.handleGetContacts();
    } else if (permission === Permissions.NOT_ASKED) {
      this.setState({ showPermissionModal: true });
    } else {
      // Change screen
    }
  }

  checkContactsStatus() {
    // On older android devices, don't even do the prompts
    if (theme.isAndroid && Platform.Version < 23) {
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
      selectNumberContact: null,
    });
    this.props
      .dispatch(getContacts(true))
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  }

  handleGetContacts() {
    this.props
      .dispatch(getContacts())
      .then(() => {
        this.setState({ permission: Permissions.AUTHORIZED });
      })
      .catch(() => {
        this.setState({ permission: Permissions.DENIED });
        LOG('contacts caught');
        //change screen
      });
  }

  handleAllowContacts() {
    if (theme.isAndroid) {
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
    this.props.dispatch(searchContacts(text)).then(results => {
      this.setState({ searchResults: results, isSearching: false });
    });
  }

  changeText(text) {
    this.setState({ searchText: text });
    this.search(text);
  }

  renderSearch() {
    if (theme.isAndroid) {
      if (!this.state.showSearch) return null;
      return (
        <AndroidSearchBar
          onChange={this.changeText}
          value={this.state.searchText}
        />
      );
    }
    return (
      <SearchBarIos onChange={this.changeText} value={this.state.searchText} />
    );
  }

  handleSelectContact = c => {
    if (!c.isVoke && c.phone.length > 1) {
      this.setState({ selectNumberContact: c });
    } else {
      this.props.onSelect(c);
    }
  };

  handleSelectedContact = (c, index) => {
    this.setState({ selectNumberContact: null });
    this.props.onSelect(c, index);
  };

  render() {
    const { t, isLoading, inShare, all, isInvite } = this.props;
    const {
      permission,
      showSearch,
      selectNumberContact,
      searchText,
      searchResults,
      showPermissionModal,
      isSearching,
      refreshing,
    } = this.state;
    const isAuthorized = permission === Permissions.AUTHORIZED;
    return (
      <View style={styles.container}>
        <Header
          left={<HeaderIcon type="back" onPress={this.handleBack} />}
          right={
            theme.isAndroid ? (
              <HeaderIcon
                type="search"
                onPress={() => this.setState({ showSearch: !showSearch })}
              />
            ) : (
              undefined
            )
          }
          title={isInvite ? t('inviteFriend') : t('contacts')}
          light={true}
          shadow={false}
        />
        {this.renderSearch()}
        {isAuthorized ? (
          <ContactsList
            isSearching={isSearching}
            items={searchText ? searchResults : all}
            onSelect={this.handleSelectContact}
            isInvite={isInvite}
            onRefresh={this.refreshContacts}
            refreshing={refreshing}
          />
        ) : (
          <Flex align="center" style={{ paddingTop: 30 }}>
            <Button
              onPress={this.handleAllowContacts}
              text={t('allowContacts')}
              style={styles.randomButton}
              buttonTextStyle={styles.randomText}
            />
          </Flex>
        )}
        {isLoading ? (
          <ApiLoading
            force={true}
            text={t('loading.contacts')}
          />
        ) : null}
        {inShare ? <ApiLoading force={true} /> : null}
        <ApiLoading />
        {isAuthorized ? <ShareModal /> : null}
        {showPermissionModal ? (
          <Modal
            onClose={() => this.setState({ showPermissionModal: false })}
            getContacts={this.handleGetContacts}
            onDismiss={this.handleDismissPermission}
          />
        ) : null}
        {selectNumberContact ? (
          <SelectNumber
            contact={selectNumberContact}
            onSelect={this.handleSelectedContact}
            onCancel={() => this.setState({ selectNumberContact: null })}
          />
        ) : null}
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
const mapStateToProps = ({ contacts, messages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  all: contacts.all,
  allLength: contacts.all.length,
  isLoading: contacts.isLoading,
  isShareModalVisible: contacts.showShareModal,
  shareModalCancel: contacts.shareModalProps.onCancel,
  inShare: messages.inShare,
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(Contacts),
);
