import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { TUser } from 'utils/types';

const useCurrentUser = (): TUser => {
  const { user } = useSelector(({ auth }: RootState) => auth);
  return user;
};

export default useCurrentUser;
