import React from 'react';
import moment from 'moment';
import { isString, momentUtc } from 'utils';

import Text from '../Text';

function DateComponent({ date, format = 'ddd, lll', ...rest }) {
  let text;
  if (isString(date) && date.indexOf('UTC') >= 0) {
    text = momentUtc(date).local().format(format);
  } else {
    text = moment(date).format(format);
  }
  return <Text {...rest}>{text}</Text>;
}
export default DateComponent;
