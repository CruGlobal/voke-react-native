import React from 'react';
import CustomTabs from '../../components/CustomTabs';
import { useMount, lockToPortrait } from '../../utils';

import AdventuresMy from '../AdventuresMy';
import AdventuresFind from '../AdventuresFind';

const Adventures = (): React.ReactElement => {
  useMount(() => {
    lockToPortrait();
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
