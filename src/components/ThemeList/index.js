
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, Image } from 'react-native';
import SELECTED from '../../../images/circle-filled.png';
import NOT_SELECTED from '../../../images/circle-empty.png';

import styles from './styles';
import { Flex, Touchable, Text, Separator, Button } from '../common';

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
    let image = NOT_SELECTED;
    if (this.state.selectedTheme === item.id) {
      image = SELECTED;
    } else {
      image = NOT_SELECTED;
    }

    return (
      <Touchable highlight={false} activeOpacity={1} onPress={()=> this.handleSelectTheme(item)}>
        <Flex style={styles.row} direction="row" align="center">
          <Flex value={5} >
            <Text style={styles.link}>{item.name}</Text>
          </Flex>
          <Flex value={.5} >
            <Image source={image} />
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          initialNumToRender={10}
          data={this.props.items}
          ItemSeparatorComponent={() => <Separator style={styles.settingsSeparator} />}
          renderItem={this.renderRow}
          keyExtractor={(item) => item.name.replace(/\s/ig, '')}
          style={styles.list}
          contentContainerStyle={styles.content}
        />
        <Flex direction="row" style={styles.buttonWrapper}>
          <Flex value={1} style={styles.buttonBorder}>
            <Button
              text="Cancel"
              buttonTextStyle={styles.actionButtonText}
              style={styles.actionButton}
              onPress={()=> this.props.onDismiss()}
            />
          </Flex>
          <Flex value={1}>
            <Button
              text="OK"
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

export default ThemeList;
