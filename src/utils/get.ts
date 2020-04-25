// Tiny get utility functions.
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import {
  TAdventureSingle,
  TAdventureSteps,
  TAdventureStepSingle,
} from '../types';

export function getStepsByAdventureId(adventureId: string): TAdventureSteps {
  const steps = useSelector(
    ({ data }: RootState) => data.adventureSteps[adventureId]
  );
  return steps;
}

// Get Single Adventure by Id.
export function getAdventureById(adventureId: string): TAdventureSingle {
  const adventures = useSelector(({ data }: RootState) => data.myAdventures);
  const adventure = adventures.find(
    (a: TAdventureSingle) => a.id === adventureId
  );
  return adventure;
}

export function getCurrentUserId(): string {
  const userId = useSelector(({ auth }: RootState) => auth.user.id);
  return userId;
}
