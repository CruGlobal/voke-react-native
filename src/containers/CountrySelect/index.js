
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList, Platform } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import styles from './styles';
import { iconsMap } from '../../utils/iconMap';
import theme from '../../theme';

import { Touchable, Text, Loading } from '../../components/common';
import SearchBarIos from '../../components/SearchBarIos';
import COUNTRIES from '../../utils/countryCodes';

const COUNTRY_HEIGHT = 50;

// This is a backup list in case the server can't load the full list
// const COUNTRIES = [
//   { id: '0', name: 'America States', code: '123' },
//   { id: '2', name: 'Albania', code: '2' },
//   { id: '1', name: 'America', code: '111' },
//   { id: '3', name: 'United States', code: '1' },
//   { id: '4', name: 'United States of America', code: '01' },
//   { id: '5', name: 'United Kingdom', code: '1111' },
//   { id: '6', name: 'Arabia', code: '7' },
//   { id: '7', name: 'Bosnia', code: '143' },
//   { id: '8', name: 'Croatia', code: '54542' },
//   { id: '9', name: 'Kazakstan', code: '32211' },
//   { id: '10', name: 'Indonesia', code: '11132' },
//   { id: '11', name: 'India', code: '4422' },
//   { id: '12', name: 'China', code: '222' },
//   { id: '13', name: 'Ireland', code: '4444' },
//   { id: '14', name: 'Brazail', code: '333' },
//   { id: '15', name: 'Sweden', code: '3452' },
//   { id: '16', name: 'Norway', code: '736' },
//   { id: '17', name: 'Malawi', code: '874' },
//   { id: '18', name: 'Jakarta', code: '997735' },
//   { id: '19', name: 'Mexico', code: '3' },
//   { id: '20', name: 'Canada', code: '221' },
// ];

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
  // return [
  //   { key: 'A', data: [{ id: '1', name: 'America', code: '1' }, { id: 'a1', name: 'Algeria', code: '1' }, { id: 'a2', name: 'Albania', code: '1' }] },
  //   { key: 'B', data: [{ id: '2', name: 'Bosnia', code: '1' }] },
  //   { key: 'C', data: [{ id: '3', name: 'Croatia', code: '1' }] },
  //   ...
  // ];
}

function setButtons() {
  if (Platform.OS === 'android') {
    return {
      leftButtons: [{ id: 'back' }],
      rightButtons: [{
        id: 'searchView',
        icon: iconsMap['md-search'],
      }],
    };
  }
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: iconsMap['ios-arrow-back'], // For iOS only
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
      all: COUNTRIES,
      searchResults: [],
      searchText: '',
      isLoading: true,
    };

    this.search = debounce(this.search.bind(this), 10);
    this.changeText = this.changeText.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
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
    this.setState({ isLoading: true });
    // TODO: Load countries from API or w/e
    setTimeout(() => {
      // Success
      this.setState({ isLoading: false, all: COUNTRIES });
      // Failure
      // this.setState({ isLoading: false });
    }, 500);

    Analytics.screen('Country Select');

  }

  search(text) {
    const newText = text.trim().toLowerCase();
    if (!newText) {
      this.setState({ searchResults: [] });
      return;
    }
    const results = COUNTRIES.filter((c) => c.name.toLowerCase().includes(newText));
    this.setState({ searchResults: results });
  }

  changeText(text) {
    this.setState({ searchText: text });
    this.search(text);
  }

  handleSelect(country) {
    this.props.onSelect(country);
    this.props.navigateBack();
  }

  renderHeader({ section }) {
    return (
      <Text style={styles.header}>
        {section.key}
      </Text>
    );
  }

  renderIOSSearch() {
    if (Platform.OS === 'android') return null;
    return (
      <SearchBarIos onChange={this.changeText} value={this.state.searchText} />
    );
  }

  render() {
    // const { items } = this.props;
    const { searchText, searchResults, isLoading, all } = this.state;

    if (isLoading) {
      return (
        <View style={[styles.container, { paddingTop: 50 }]}>
          <Loading color={theme.primaryColor} />
        </View>
      );
    }

    const items = searchText ? searchResults : all;

    const formattedSections = formatCountry(items);
    return (
      <View style={styles.container}>
        {this.renderIOSSearch()}
        <SectionList
          initialNumToRender={15}
          keyExtractor={(item) => item.iso}
          stickySectionHeadersEnabled={true}
          sections={formattedSections}
          renderSectionHeader={this.renderHeader}
          renderItem={({ item }) => (
            <Touchable key={item.iso} highlight={true} onPress={() => this.handleSelect(item)}>
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
