import React, { PropTypes } from 'react';
import moment from 'moment';
import Text from '../Text';

export default function DateComponent({ date, format, ...rest }) {
  const text = moment(date).format(format);
  return (
    <Text {...rest}>
      {text}
    </Text>
  );
}

DateComponent.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  format: PropTypes.string,
};

DateComponent.defaultProps = {
  format: 'ddd, lll',
};
