import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigateBack } from '../../actions/nav';
import styles from './styles';
import theme from '../../theme';
import st from '../../st';
import { Flex, Text, Button } from '../../components/common';

export const HeaderIcon = ({ type, icon, showDot, ...rest }) => {
  let myProps = {};
  if (type) {
    if (type === 'back') {
      if (theme.isAndroid) {
        myProps.icon = 'arrow-back';
      } else {
        myProps.icon = 'back_arrow';
        myProps.iconType = 'Voke';
      }
    } else if (type === 'search') {
      myProps.icon = 'search';
      myProps.iconType = 'Voke';
    }
  } else {
    myProps.icon = icon;
  }
  if (!type && myProps.icon) {
    myProps.iconType = 'Voke';
  }
  if (myProps.icon) {
    myProps.iconStyle = styles.headerIconSize;
  }
  if (showDot) {
    console.log('herhkehrehrkl');
    return (
      <Flex direction="row" align="center" justify="center">
        <Button
          type="transparent"
          style={styles.headerIcon}
          {...rest}
          {...myProps}
        />
        <View style={[st.bgYellow, st.circle(10), { marginLeft: -15 }]} />
      </Flex>
    );
  }
  return (
    <Button
      type="transparent"
      style={styles.headerIcon}
      {...rest}
      {...myProps}
    />
  );
};

class Header extends Component {
  renderLeft() {
    let { left, leftBack } = this.props;
    // Easy way to add a back button on the header left
    if (!left && leftBack) {
      if (theme.isAndroid) {
        left = (
          <HeaderIcon
            icon="arrow-back"
            onPress={() => this.props.dispatch(navigateBack())}
          />
        );
      } else {
        left = (
          <HeaderIcon
            icon="back_arrow"
            onPress={() => this.props.dispatch(navigateBack())}
          />
        );
      }
    }
    if (theme.isAndroid && !left) {
      // Empty space along the left side
      return <Flex style={{ padding: 10 }} />;
    }
    return (
      <Flex align="start" justify="center" style={styles.left}>
        {left || null}
      </Flex>
    );
  }
  renderCenter() {
    let { title, center } = this.props;
    if (title) {
      center = (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      );
    }
    return (
      <Flex value={1} style={styles.center}>
        {center || null}
      </Flex>
    );
  }
  renderRight() {
    const { right } = this.props;
    return (
      <Flex align="end" justify="center" style={styles.right}>
        {right || null}
      </Flex>
    );
  }
  render() {
    const { light, shadow } = this.props;
    return (
      <Flex
        direction="row"
        style={[
          styles.header,
          light ? styles.light : styles.dark,
          shadow ? styles.shadow : undefined,
        ]}
      >
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </Flex>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  left: PropTypes.element,
  center: PropTypes.element,
  right: PropTypes.element,
  leftBack: PropTypes.bool,
  shadow: PropTypes.bool,
};

Header.defaultProps = {
  shadow: true,
};

export default translate()(connect()(Header));
