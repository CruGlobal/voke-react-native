// Tiny get utility functions.
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../reducers';
import {
  TAdventureSingle,
  TAdventureSteps,
  TAdventureStepSingle,
} from '../types';

// Get Single Adventure by Id.
export function getAdventureById(adventureId: string): TAdventureSingle {
  const adventures = useSelector(({ data }: RootState) => data.myAdventures.byId);
  const adventure = adventures[adventureId];
  return adventure;
}

export function getCurrentUserId(): string {
  const userId = useSelector(({ auth }: RootState) => auth.user.id);
  return userId;
}

export function getCurrentUser(): string {
  const { user } = useSelector(({ auth }: RootState) => auth);
  return user;
}


export function getNextReleaseDate({startDate, releasePeriod}): string {
  return moment(startDate).add(
    releasePeriod,
    'days',
  );
}

export function getDiffToDate(date): string {
  return moment().to(date);
}

export function getTimeToDate(date): string {
  return date.format('h:mm a');
}

export function getExpiredTime(date: string) {
  const nowMoment = moment();
  const expireMoment = moment.utc(date);
  const diff = moment(expireMoment).diff(nowMoment);
  const diffDuration = moment.duration(diff);
  const days = diffDuration.days();
  const hours = diffDuration.hours();
  const minutes = diffDuration.minutes();

  // TODO: Translate it.
  const str = `${days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}${
    hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''
  }${minutes >= 0 ? `${minutes} min ` : ''}`;
  return { str, isTimeExpired: (diff < 0) };
}