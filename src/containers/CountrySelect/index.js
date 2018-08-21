import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, SectionList } from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/nav';
import styles from './styles';

import { Touchable, Text } from '../../components/common';
import COUNTRIES from '../../utils/countryCodes';
import SearchBarIos from '../../components/SearchBarIos';
import AndroidSearchBar from '../../components/AndroidSearchBar';
import Header, { HeaderIcon } from '../Header';
import theme from '../../theme';

const COUNTRY_HEIGHT = 50;

// Format countries for the section list broken up by letters
function formatCountry(items) {
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const sections = items
    .reduce((p, n) => {
      const letterIndex = ALPHA.findIndex(
        a => n.name[0] && a === n.name[0].toUpperCase(),
      );
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
    }, [])
    .filter(c => !!c);
  return sections;
}

class CountrySelect extends Component {
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
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.CountrySelect);
  }

  close() {
    this.props.navigateBack();
  }

  search(text) {
    const newText = text.trim().toLowerCase();
    if (!newText) {
      this.setState({ searchResults: [] });
      return;
    }
    const results = COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(newText),
    );
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
    return <Text style={styles.header}>{section.key}</Text>;
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

  render() {
    const { t } = this.props;
    const { showSearch, searchText, searchResults, all } = this.state;

    const items = searchText ? searchResults : all;

    return (
      <View style={styles.container}>
        <Header
          left={
            theme.isAndroid ? (
              <HeaderIcon icon="close" onPress={this.close} />
            ) : (
              <HeaderIcon
                icon="ios-close"
                iconType="Ionicons"
                style={{
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                }}
                onPress={this.close}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <HeaderIcon
                icon="search"
                onPress={() => this.setState({ showSearch: !showSearch })}
              />
            ) : (
              undefined
            )
          }
          title={t('title.selectCountry')}
          light={true}
          shadow={false}
        />
        {this.renderSearch()}
        <SectionList
          initialNumToRender={25}
          keyExtractor={item => item.iso}
          stickySectionHeadersEnabled={true}
          sections={items}
          keyboardShouldPersistTaps="always"
          renderSectionHeader={this.renderHeader}
          renderItem={({ item }) => (
            <Touchable highlight={true} onPress={() => this.handleSelect(item)}>
              <View style={styles.row}>
                <Text style={styles.name}>
                  {`${item.name} (+${item.code})`}
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
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(CountrySelect),
);
