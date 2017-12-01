import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { logout } from '../../actions/auth';
import { navigateBack } from '../../actions/nav';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import { vokeIcons } from '../../utils/iconMap';

export const HeaderIcon = ({ icon, ...rest }) => (
  <Button
    type="transparent"
    style={styles.headerIcon}
    iconStyle={icon ? styles.headerIconSize : undefined}
    icon={icon}
    {...rest}
  />
);

class Header extends Component {
  renderLeft() {
    let { left, leftBack } = this.props;
    // Easy way to add a back button on the header left
    if (!left && leftBack) {
      left = (
        <HeaderIcon
          image={vokeIcons['back']}
          onPress={() => this.props.dispatch(navigateBack())} />
      );
    }
    return (
      <Flex align="start" justify="center" style={styles.left}>
        {left || null}
      </Flex>
    );
  }
  renderCenter() {
    const { title, center } = this.props;
    if (title) {
      return (
        <Flex value={1} align="center" justify="center" value={1} style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </Flex>
      );
    }
    return (
      <Flex align="center" justify="center" value={1} style={styles.center}>
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
    const { light } = this.props;
    return (
      <Flex
        direction="row"
        style={[
          styles.header,
          light ? styles.light : styles.dark,
        ]}>
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

export default connect()(Header);
