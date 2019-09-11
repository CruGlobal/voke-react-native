import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import {
  View,
  FlatList,
  Flex,
  Touchable,
  Text,
  VokeIcon,
  Separator,
  Button,
} from '../common';
import CONSTANTS from '../../constants';

class ThemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTheme: this.props.items[0].id,
    };
    this.renderRow = this.renderRow.bind(this);
    this.handleSelectTheme = this.handleSelectTheme.bind(this);
    this.handleSetTheme = this.handleSetTheme.bind(this);
  }

  handleSelectTheme(item) {
    this.setState({ selectedTheme: item.id });
  }

  handleSetTheme() {
    this.props.onSelectTheme(this.state.selectedTheme);
  }

  renderRow({ item }) {
    const { selectedTheme } = this.state;
    if (!item || !item.name || !item.id) return null;
    return (
      <Touchable
        highlight={false}
        activeOpacity={1}
        onPress={() => this.handleSelectTheme(item)}
      >
        <Flex style={styles.row} direction="row" align="center">
          <Flex value={5}>
            <Text style={styles.link}>{item.name}</Text>
          </Flex>
          <Flex value={0.5}>
            <VokeIcon
              type="image"
              name={selectedTheme === item.id ? 'selected' : 'not-selected'}
            />
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { t, onDismiss, items } = this.props;
    if (!items) return null;
    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender={CONSTANTS.PAGE_SIZE}
          data={items}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={this.renderRow}
          keyExtractor={item => {
            if (!item || !item.name) {
              return '';
            }
            return item.name.replace(/\s/gi, '');
          }}
          style={styles.list}
          contentContainerStyle={styles.content}
          removeClippedSubviews={false}
        />
        <Flex direction="row" style={styles.buttonWrapper}>
          <Flex value={1} style={styles.buttonBorder}>
            <Button
              text={t('cancel')}
              buttonTextStyle={styles.actionButtonText}
              style={styles.actionButton}
              onPress={onDismiss}
            />
          </Flex>
          <Flex value={1}>
            <Button
              text={t('ok')}
              buttonTextStyle={styles.actionButtonText}
              style={styles.actionButton}
              onPress={this.handleSetTheme}
            />
          </Flex>
        </Flex>
      </View>
    );
  }
}

ThemeList.propTypes = {
  items: PropTypes.array.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onSelectTheme: PropTypes.func.isRequired,
};

export default translate()(ThemeList);
