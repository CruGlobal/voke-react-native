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
  const diffDurationDays = moment.duration(diff).days();
  let daysStartToNext = releasePeriod;
  // If release date happened a few days ago,
  // calculate how many times it was already released,
  // and then add releasePeriod value to find the date of the next release.
  if (diffDurationDays < 0) {
    const timesReleased = Math.abs(
      Math.round(diffDurationDays / releasePeriod),
    );
    // const lastReleaseDaysAgo = timesReleased * releasePeriod + diffDurationDays;
    // daysStartToNext = lastReleaseDaysAgo + releasePeriod;
    daysStartToNext = timesReleased * releasePeriod + releasePeriod;
  }
  // If daily release and released today and next release is today.
  // Set daysStartToNext to zero.
  if (releasePeriod === 1 && diffDurationDays === 0) {
    // Extract Release Time Only.
    const releaseTime = moment(startDate).format('h:mm A');
    // Add Release Time to Today's date.
    const releaseToday = moment(
      moment().format('DD MM YYYY') + ' ' + releaseTime,
      'DD MM YYYY h:mm a',
    )
      .utc()
      .format();

    // Check if Today's release is in the past or in the future.
    const releaseTodayDiff = moment(releaseToday).diff(moment());

    if (releaseTodayDiff > 0) {
      // If Toda's release didn't happed yet, son't add extra days.
      daysStartToNext = 0;
    }
  }

  return moment(startDate).add(daysStartToNext, 'days').utc().format();
}

export function getDiffToDate(date: string): string {
  return moment().to(date);
}

export function getTimeToDate(date: string): string {
  return moment(date).format('h:mm a');
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
