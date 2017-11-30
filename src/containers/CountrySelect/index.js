
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList, Platform } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { Navigation } from 'react-native-navigation';

import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/nav';
import styles from './styles';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';

import { Touchable, Text } from '../../components/common';
import COUNTRIES from '../../utils/countryCodes';
import SearchBarIos from '../../components/SearchBarIos';
import AndroidSearchBar from '../../components/AndroidSearchBar';

const COUNTRY_HEIGHT = 50;

// Format countries for the section list broken up by letters
function formatCountry(items) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const sections = items.reduce((p, n) => {
    const letterIndex = ALPHA.findIndex((a) => n.name[0] && a === n.name[0].toUpperCase());
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
}

function setButtons() {
  if (Platform.OS === 'android') {
    return {
      leftButtons: [{ id: 'cancel' }],
      rightButtons: [{
        id: 'search',
        icon: iconsMap['md-search'],
      }],
    };
  }
  return {
    leftButtons: [{
      id: 'cancel',
      icon: iconsMap['ios-close'],
    }],
  };
}

class CountrySelect extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  };
  
  constructor(props) {
    super(props);

    this.state = {
      all: formatCountry(COUNTRIES),
      searchResults: [],
      searchText: '',
      showSearch: false,
    };

    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'cancel') {
        this.close();
      } else if (event.id === 'search') {
        this.setState({ showSearch: !this.state.showSearch });
      }
    } else if (event.id === 'searchQueryChange') { // Android header search
      const text = event.query || '';
      this.changeText(text);
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  componentDidMount() {
    Analytics.screen('Country Select');
  }

  close() {
    Navigation.dismissModal({ animationType: 'slide-down' });
  }

  search(text) {
    const newText = text.trim().toLowerCase();
    if (!newText) {
      this.setState({ searchResults: [] });
      return;
    }
    const results = COUNTRIES.filter((c) => c.name.toLowerCase().includes(newText));
    this.setState({ searchResults: formatCountry(results) });
  }

  changeText(text) {
    this.setState({ searchText: text });
    this.search(text);
  }

  handleSelect(country) {
    this.props.onSelect(country);
    this.close();  
  }

  renderHeader({ section }) {
    return (
      <Text style={styles.header}>
        {section.key}
      </Text>
    );
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
    const { searchText, searchResults, all } = this.state;

    const items = searchText ? searchResults : all;

    return (
      <View style={styles.container}>
        {this.renderSearch()}
        <SectionList
          initialNumToRender={25}
          keyExtractor={(item) => item.iso}
          stickySectionHeadersEnabled={true}
          sections={items}
          keyboardShouldPersistTaps="always"
          renderSectionHeader={this.renderHeader}
          renderItem={({ item }) => (
            <Touchable highlight={true} onPress={() => this.handleSelect(item)}>
              <View style={styles.row}>
                <Text style={styles.name}>
                  {item.name} (+{item.code})
                </Text>
              </View>
            </Touchable>
          )}
          getItemLayout={(data, index) => ({
            length: COUNTRY_HEIGHT,
            offset: COUNTRY_HEIGHT * index,
            index,
          })}
        />
      </View>
    );
  }
}

CountrySelect.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
};

export default connect(null, nav)(CountrySelect);
