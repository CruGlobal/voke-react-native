import React from 'react';
import CustomTabs from '../../components/CustomTabs';
import { useMount, lockToPortrait } from '../../utils';
import { useSelector } from 'react-redux';

import AdventuresMy from '../AdventuresMy';
import AdventuresFind from '../AdventuresFind';

const Adventures = (): React.ReactElement => {
  const myAdventuresIds = useSelector(({ data }: {data: TDataState}) => data.myAdventures.allIds)|| [];
  const invitationsIds = useSelector(({ data }: {data: TDataState}) => data.adventureInvitations.allIds) || [];
  const showMyAdventures = (myAdventuresIds.length > 0 || invitationsIds.length > 0) ? true : false;

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
        }
      ]}
      // If there are any Adventures or Invites:
      // Show My Adventures tab first.
      // Otherwise redirect user to Find Adventures.
      selectedIndex={ showMyAdventures ? 0 : 1}
    />
  );
};

export default Adventures;
