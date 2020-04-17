import React from 'react';
import Orientation from 'react-native-orientation-locker';
import CustomTabs from '../../components/CustomTabs';
import { useMount } from '../../utils';

import AdventuresMy from '../AdventuresMy';
import AdventuresFind from '../AdventuresFind';

const Adventures = (): React.ReactElement => {
  useMount(() => {
    Orientation.lockToPortrait();
  });

  return (
    <CustomTabs
      tabs={[
        {
          key: 'my',
          title: 'My Adventures',
          testID: 'adventuresMy',
          component: AdventuresMy,
        },
        {
          key: 'find',
          title: 'Find Adventures',
          testID: 'adventuresFind',
          component: AdventuresFind,
        },
      ]}
    />
  );
};

export default Adventures;
