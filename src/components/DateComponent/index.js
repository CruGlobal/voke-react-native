import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Text from '../Text';

export default class DateComponent extends Component {
  render() {
    const { date, format, ...rest } = this.props;
    const text = moment(date).format(format);
    return (
      <Text {...rest}>
        {text}
      </Text>
    );
  }
}

DateComponent.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  format: PropTypes.string,
};

DateComponent.defaultProps = {
  format: 'ddd, lll',
};
