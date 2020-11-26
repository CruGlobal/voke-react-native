import React, { useState } from 'react';
import { View, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from 'components/Text';
import Screen from 'components/Screen';
import Button from 'components/Button';
import Datepicker from 'components/Datepicker';
import Spacer from 'components/Spacer';

import StorybookUIRoot from '../../../../storybook';

const StoryBook = props => {
  return (
    <ScrollView
      // Makes elements inside responsive on the first tap.
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        backgroundColor: 'white',
        flex: 1,
      }}
      scrollIndicatorInsets={{ right: 1 }}
    >
      <StorybookUIRoot />
    </ScrollView>
  );
};

export default StoryBook;
