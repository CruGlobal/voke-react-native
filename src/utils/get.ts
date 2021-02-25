// Tiny get utility functions.
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from 'reducers';
import { TAdventureSingle } from 'utils/types';

// Get Single Adventure by Id.
export function getAdventureById(adventureId: string): TAdventureSingle {
  const adventures = useSelector(
    ({ data }: RootState) => data.myAdventures.byId,
  );
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

export function getNextReleaseDate({ startDate, releasePeriod }): string {
  const diff = moment(startDate).diff(moment());
  // diff > 0 - startDate is in the future
  // diff < 0 - startDate is in the past
  const diffDurationDays = moment.duration(diff).days();

  let daysStartToNext = releasePeriod;
  // If release date happened a few days ago,
  // calculate how many times it was already released,
  // and then add releasePeriod value to find the date of the next release.
  if (diff < 0) {
    let timesReleased = Math.abs(diffDurationDays / releasePeriod);
    if (timesReleased > 1) {
      timesReleased = Math.floor(diffDurationDays / releasePeriod);
    } else {
      timesReleased = 1;
    }

    daysStartToNext = timesReleased * releasePeriod;
  }
  if (diff > 0) {
    daysStartToNext = 0;
  }

  return moment(startDate).add(daysStartToNext, 'days').utc().format();
}

export function getDiffToDate(date: string): string {
  return moment().to(date);
}

export function getTimeToDate(date: string): string {
  return moment(date).format('ddd, MMM Do, h:mm[\u00A0]a');
}

export function getExpiredTime(
  date: string,
): {
  str: string;
  isTimeExpired: boolean;
} {
  const diff = moment(date).diff(moment.now());
  const isTimeExpired = diff < 0;
  let str = '';
  if (diff > 0) {
    const diffDuration = moment.duration(diff);
    const days = diffDuration.days();
    const hours = diffDuration.hours();
    const minutes = diffDuration.minutes();

    // TODO: Translate it.
    str = `${days > 0 ? `${days} day${days !== 1 ? 's' : ''} ` : ''}${
      hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''} ` : ''
    }${minutes >= 0 ? `${minutes} min ` : ''}`;
  }
  return { str, isTimeExpired };
}
